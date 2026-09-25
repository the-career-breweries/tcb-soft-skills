import re

files = [
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\computing-skills\ug\bba-aviation\sem1\weekMid-Sem.md',
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\computing-skills\ug\bsc-aviation\sem1\weekMid-Sem.md'
]

replacement = """- **Block Diagram of a Computer:**

```mermaid
flowchart LR
    A[Input Unit<br/>Keyboard, Mouse] --> B((CPU<br/>CU + ALU))
    B <--> C[(Memory Unit<br/>RAM, HDD)]
    B --> D[Output Unit<br/>Monitor, Printer]
    
    style A fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff
    style B fill:#9333ea,stroke:#6b21a8,stroke-width:2px,color:#fff
    style C fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff
    style D fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
```

  - **Input Unit:** Takes data from the user (e.g., Keyboard, Mouse, Scanner).
  - **Central Processing Unit (CPU):** The "brain". Consists of:
    - **Control Unit (CU):** Directs operation of the processor.
    - **Arithmetic Logic Unit (ALU):** Performs math and logical operations.
  - **Memory/Storage Unit:** Stores data (RAM for temporary, Hard Disk for permanent).
  - **Output Unit:** Presents data to the user (e.g., Monitor, Printer, Speaker).

- **Data Flow:** Input ➡️ CPU (Processes with Memory) ➡️ Output."""

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # We know what the current block looks like because we just replaced it.
    # It currently starts with "- **Block Diagram of a Computer:**" and ends with "Output."
    
    pattern = re.compile(r'- \*\*Block Diagram of a Computer:\*\*.*?Output\.', re.DOTALL)
    
    content = pattern.sub(replacement, content)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
