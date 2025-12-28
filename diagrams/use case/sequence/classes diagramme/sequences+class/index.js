 
        function showDiagram(index) {
            // Hide all diagrams
            const diagrams = document.querySelectorAll('.diagram-container');
            diagrams.forEach(diagram => diagram.classList.remove('active'));
            
            // Remove active class from all tabs
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // Show selected diagram
            diagrams[index].classList.add('active');
            tabs[index].classList.add('active');
        }
        
        // Print functionality
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                window.print();
            }
        });
    