# stitch_welcome_to_brew_co

Design asset package only.

## Scope

- This folder contains visual assets exported from Stitch-style design generations.
- It is not an implemented product/app codebase.
- Do not treat `code.html` files here as production-ready implementation.

## Asset Convention

Each screen folder should contain:
- `screen.png` (visual reference)
- `code.html` (generated markup snippet/reference)

## Validation

Run the validator to confirm asset completeness:

```powershell
powershell -ExecutionPolicy Bypass -File .\validate-assets.ps1
```

Expected result: every folder reports both required files present.
