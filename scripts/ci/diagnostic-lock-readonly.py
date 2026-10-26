import json, os
from pathlib import Path
locks={str(Path('/var/lib/ci-build-lock')/name) for name in ('heavy.lock','light.lock','docker-build.lock')}
result={'diagnosticOnly':True,'fullQa':'not-run','locks':[], 'descriptors':[], 'deniedProcesses':0}
for line in Path('/proc/locks').read_text().splitlines():
    if any(str(Path(p).stat().st_ino) in line for p in locks): result['locks'].append(line)
for proc in Path('/proc').iterdir():
    if not proc.name.isdecimal(): continue
    try:
        if proc.stat().st_uid != os.getuid(): continue
        for fd in (proc/'fd').iterdir():
            try: target=os.readlink(fd)
            except (FileNotFoundError,PermissionError): continue
            if target not in locks: continue
            result['descriptors'].append({'pid':int(proc.name),'fd':fd.name,'lock':target,'comm':(proc/'comm').read_text().strip(),'cgroup':(proc/'cgroup').read_text().strip()})
    except (FileNotFoundError,PermissionError): result['deniedProcesses']+=1
Path('diagnostic-lock-readonly.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
