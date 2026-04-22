The component at $ARGUMENTS is too large. Split it.

Process:
1. Plan Mode ON
2. Identify logical sections (each section = candidate subcomponent)
3. Identify repeated blocks (candidate for map + single component)
4. Identify stateful logic (candidate for hook)
5. Propose new file tree under the component's folder
6. Wait for my approval
7. Execute split preserving behavior
8. Update parent imports

Target: no file >150 lines after split.