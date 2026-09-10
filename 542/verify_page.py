import urllib.request

req = urllib.request.Request('http://localhost:8080/index.html')
with urllib.request.urlopen(req) as response:
    content = response.read().decode('utf-8')
    print('HTTP Status:', response.status)
    print('Content Length (bytes):', len(content))
    checks = [
        'Daisy Bollepogu',
        'Dhanekula Institute of Engineering',
        'Quantum Computing',
        'Smart India Hackathon',
        'webgl-bg-canvas',
        'skill-sphere-canvas',
        'terminal-input',
        'cyber-contact-form',
        'assets/Daisy_Resume_FSD.docx',
        'assets/avatar.png'
    ]
    all_pass = True
    for check in checks:
        if check in content:
            print(f'[PASS] Found "{check}"')
        else:
            print(f'[FAIL] Missing "{check}"')
            all_pass = False
    
    if all_pass:
        print("\n>>> ALL VALIDATION CHECKS PASSED SUCCESSFULLY! <<<")
