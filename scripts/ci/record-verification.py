import hashlib, json, os, subprocess
from pathlib import Path
sha = subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip()
assert sha == os.environ['GITHUB_SHA']
v2 = json.loads(Path('output/playwright/v2/report.json').read_text())
course = json.loads(Path('output/playwright/course-refactor/report.json').read_text())
assert not v2['errors'] and not course['errors']
assert len(v2['matrix']) == 27 and len(v2['interactionChecks']) == 24
assert len(course['rows']) == 3
files = {str(p.relative_to('dist')): hashlib.sha256(p.read_bytes()).hexdigest()
         for p in sorted(Path('dist').rglob('*')) if p.is_file()}
assert 'index.html' in files
receipt = dict(sourceSha=sha, sourceTree=subprocess.check_output(['git', 'rev-parse', 'HEAD^{tree}'], text=True).strip(),
    runner=os.environ['RUNNER_NAME'], modelVerification='passed', browserVerification='passed',
    browser=v2['browser'], viewportSurfaceRows=len(v2['matrix']), interactionChecks=len(v2['interactionChecks']),
    routeChecks=len(v2['routeChecks']), contrastSamples=len(v2['contrastChecks']), courseViewports=len(course['rows']),
    deployment='not-run', humanLearningReview='not-run', distFiles=files)
Path('ci-verification.json').write_text(json.dumps(receipt, indent=2) + '\n')
with open(os.environ['GITHUB_OUTPUT'], 'a') as out:
    out.write(f'sha={sha}\n')
