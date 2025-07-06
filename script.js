class FolderOrganizer {
    constructor() {
        this.folderForm = document.getElementById('folderForm');
        this.folderNameInput = document.getElementById('folderName');
        this.folderNumberInput = document.getElementById('folderNumber');
        this.previewFolderName = document.getElementById('previewFolderName');
        this.saveBtn = document.querySelector('.save-btn');
        this.notification = document.getElementById('notification');
        this.notificationMessage = document.getElementById('notificationMessage');
        this.addSubfolderBtn = document.getElementById('addSubfolderBtn');
        this.subfoldersInputs = document.getElementById('subfoldersInputs');
        this.onlySubfoldersSwitch = document.getElementById('onlySubfoldersSwitch');
        
        this.subfolders = ['_Layout', '_Links', 'Final', 'Preview', 'Referencias', 'Texto'];
        this.dynamicSubfolders = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updatePreview();
    }

    setupEventListeners() {
        // Preview em tempo real
        this.folderNameInput.addEventListener('input', () => {
            // Remover acentos e converter para maiúsculas
            this.folderNameInput.value = this.removeAccents(this.folderNameInput.value).toUpperCase();
            this.updatePreview();
        });

        this.folderNumberInput.addEventListener('input', () => {
            this.updatePreview();
        });

        // Submissão do formulário
        this.folderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createFolders();
        });

        // Foco no input ao carregar a página
        this.folderNameInput.focus();

        // Adicionar subpasta dinâmica
        this.addSubfolderBtn.addEventListener('click', () => {
            this.addDynamicSubfolderInput();
        });

        // Alternar modo "apenas subpastas"
        if (this.onlySubfoldersSwitch) {
            this.onlySubfoldersSwitch.addEventListener('change', () => {
                const onlySubs = this.onlySubfoldersSwitch.checked;
                this.folderNameInput.disabled = onlySubs;
                this.folderNumberInput.disabled = onlySubs;
                // Atualizar preview para refletir estado
                this.updatePreview();
            });
        }
    }

    updatePreview() {
        const onlySubfolders = this.onlySubfoldersSwitch && this.onlySubfoldersSwitch.checked;
        
        if (onlySubfolders) {
            // Modo "apenas subpastas" - mostrar texto fixo
            this.previewFolderName.textContent = 'Salvar apenas subpastas';
            this.updateSubfoldersPreview();
            return;
        }
        
        // Modo normal - usar nome digitado
        const folderName = this.folderNameInput.value.trim();
        const folderNumber = this.folderNumberInput.value.trim();
        const sanitizedName = this.sanitizeFolderName(folderName);
        
        let finalName = sanitizedName || 'NOME DA PASTA';
        
        if (folderNumber) {
            // Formatar número com zeros à esquerda baseado no tamanho
            const numberLength = folderNumber.length;
            const minLength = Math.max(3, numberLength);
            const formattedNumber = folderNumber.padStart(minLength, '0');
            finalName = `${formattedNumber}. ${finalName}`;
        }
        
        // Atualizar nome da pasta principal
        this.previewFolderName.textContent = finalName;
        
        // Atualizar preview das subpastas dinâmicas
        this.updateSubfoldersPreview();
    }

    updateSubfoldersPreview() {
        const folderStructure = document.querySelector('.folder-structure');
        const rows = this.subfoldersInputs.querySelectorAll('.subfolder-row');
        
        // Remover subpastas existentes no preview
        const existingSubfolders = folderStructure.querySelector('.subfolders');
        if (existingSubfolders) {
            existingSubfolders.remove();
        }
        
        // Se houver linhas de subpastas, criar preview
        if (rows.length > 0) {
            const subfoldersContainer = document.createElement('div');
            subfoldersContainer.className = 'subfolders';
            
            rows.forEach(row => {
                const numberInput = row.querySelector('.subfolder-number');
                const nameInput = row.querySelector('.subfolder-name');
                const number = numberInput.value.trim();
                const name = nameInput.value.trim().toUpperCase();
                
                let displayName = 'NOME DA SUBPASTA';
                if (name) {
                    const sanitizedName = this.sanitizeFolderName(name);
                    displayName = sanitizedName || 'NOME DA SUBPASTA';
                }
                
                let finalDisplayName = displayName;
                if (number) {
                    finalDisplayName = `${number}. ${displayName}`;
                }
                
                const subfolderItem = document.createElement('div');
                subfolderItem.className = 'folder-item subfolder';
                subfolderItem.innerHTML = `
                    <span class="folder-icon">📁</span>
                    <span class="folder-name">${finalDisplayName}</span>
                `;
                subfoldersContainer.appendChild(subfolderItem);
            });
            
            folderStructure.appendChild(subfoldersContainer);
        }
    }

    removeAccents(text) {
        const accentMap = {
            'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A',
            'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
            'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
            'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O',
            'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
            'Ç': 'C', 'Ñ': 'N',
            'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
            'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
            'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
            'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
            'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
            'ç': 'c', 'ñ': 'n'
        };
        
        return text.replace(/[À-ÿ]/g, char => accentMap[char] || char);
    }

    sanitizeFolderName(name) {
        return this.removeAccents(name)
            .toUpperCase()
            .replace(/[^A-Z0-9\s]/g, '') // Remove caracteres especiais (mantém maiúsculas e espaços)
            .replace(/\s+/g, ' ') // Remove espaços duplicados
            .trim();
    }

    addDynamicSubfolderInput() {
        const row = document.createElement('div');
        row.className = 'subfolder-row';
        row.dataset.index = this.subfoldersInputs.children.length;

        // Número
        const numberGroup = document.createElement('div');
        numberGroup.className = 'input-group number-input';
        const numberLabel = document.createElement('label');
        numberLabel.textContent = 'Número:';
        numberLabel.htmlFor = '';
        const numberInput = document.createElement('input');
        numberInput.type = 'number';
        numberInput.placeholder = '000';
        numberInput.min = '0';
        numberInput.style.textTransform = 'none';
        numberInput.className = 'subfolder-number';
        numberGroup.appendChild(numberLabel);
        numberGroup.appendChild(numberInput);

        // Nome
        const nameGroup = document.createElement('div');
        nameGroup.className = 'input-group';
        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Nome da Subpasta:';
        nameLabel.htmlFor = '';
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'NOME DA SUBPASTA';
        nameInput.required = true;
        nameInput.style.textTransform = 'uppercase';
        nameInput.className = 'subfolder-name';
        nameGroup.appendChild(nameLabel);
        nameGroup.appendChild(nameInput);

        // Drag handle
        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        dragHandle.innerHTML = '⋮⋮';
        dragHandle.title = 'Arraste para reordenar';
        dragHandle.draggable = true;

        // Remover botão
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-subfolder-btn';
        removeBtn.textContent = 'Remover';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            // Adicionar classe para desabilitar transições durante a remoção
            row.classList.add('removing');
            
            // Remover o elemento com um pequeno delay para evitar conflitos
            setTimeout(() => {
                if (row.parentNode) {
                    row.remove();
                    this.updateSubfoldersPreview();
                    this.updateRowIndices();
                }
            }, 10);
        });

        // Event listeners para atualizar preview
        numberInput.addEventListener('input', () => {
            this.updateSubfoldersPreview();
        });

        nameInput.addEventListener('input', () => {
            nameInput.value = this.removeAccents(nameInput.value).toUpperCase();
            this.updateSubfoldersPreview();
        });

        // Atualizar preview imediatamente quando o input ganha foco
        nameInput.addEventListener('focus', () => {
            this.updateSubfoldersPreview();
        });

        numberInput.addEventListener('focus', () => {
            this.updateSubfoldersPreview();
        });

        // Drag and drop event listeners - apenas no drag handle
        dragHandle.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', row.outerHTML);
            e.dataTransfer.setData('text/plain', row.dataset.index);
            
            // Add dragging class with slight delay for smooth transition
            setTimeout(() => {
                row.classList.add('dragging');
            }, 50);
            
            // Add visual feedback to other rows
            const allRows = this.subfoldersInputs.querySelectorAll('.subfolder-row');
            allRows.forEach(r => {
                if (r !== row) {
                    r.classList.add('drag-target-available');
                }
            });
        });

        dragHandle.addEventListener('dragend', () => {
            row.classList.remove('dragging');
            
            // Remove all drag-related classes
            const allRows = this.subfoldersInputs.querySelectorAll('.subfolder-row');
            allRows.forEach(r => {
                r.classList.remove('drag-target-available', 'drag-over', 'drop-target');
            });
        });

        row.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            // Add visual feedback for drag over
            if (!row.classList.contains('dragging')) {
                row.classList.add('drag-over');
            }
        });

        row.addEventListener('dragleave', (e) => {
            // Remove drag-over class when leaving the element
            if (!row.contains(e.relatedTarget)) {
                row.classList.remove('drag-over');
            }
        });

        row.addEventListener('dragenter', (e) => {
            e.preventDefault();
            if (!row.classList.contains('dragging')) {
                row.classList.add('drop-target');
            }
        });

        row.addEventListener('drop', (e) => {
            e.preventDefault();
            row.classList.remove('drag-over', 'drop-target');
            
            const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
            const targetIndex = parseInt(row.dataset.index);
            
            if (draggedIndex !== targetIndex) {
                this.reorderSubfolders(draggedIndex, targetIndex);
            }
        });

        row.appendChild(dragHandle);
        row.appendChild(numberGroup);
        row.appendChild(nameGroup);
        row.appendChild(removeBtn);

        this.subfoldersInputs.appendChild(row);
        this.updateSubfoldersPreview();
        this.updateRowIndices();
    }

    updateRowIndices() {
        const rows = this.subfoldersInputs.querySelectorAll('.subfolder-row');
        rows.forEach((row, index) => {
            row.dataset.index = index;
        });
    }

    reorderSubfolders(fromIndex, toIndex) {
        const rows = Array.from(this.subfoldersInputs.querySelectorAll('.subfolder-row'));
        const draggedRow = rows[fromIndex];
        const targetRow = rows[toIndex];
        
        if (draggedRow && targetRow) {
            // Remove dragged row
            draggedRow.remove();
            
            // Insert at new position
            if (fromIndex < toIndex) {
                targetRow.insertAdjacentElement('afterend', draggedRow);
            } else {
                targetRow.insertAdjacentElement('beforebegin', draggedRow);
            }
            
            // Update indices and preview
            this.updateRowIndices();
            this.updateSubfoldersPreview();
        }
    }

    getDynamicSubfolders() {
        const rows = this.subfoldersInputs.querySelectorAll('.subfolder-row');
        const result = [];
        rows.forEach(row => {
            const numberInput = row.querySelector('.subfolder-number');
            const nameInput = row.querySelector('.subfolder-name');
            let name = nameInput.value.trim().toUpperCase();
            name = this.sanitizeFolderName(name);
            let finalName = name;
            if (numberInput.value.trim()) {
                const folderNumber = numberInput.value.trim();
                finalName = `${folderNumber}. ${name}`;
            }
            if (finalName) {
                result.push(finalName);
            }
        });
        return result;
    }

    async createFolders() {
        const onlySubfolders = this.onlySubfoldersSwitch && this.onlySubfoldersSwitch.checked;

        const folderName = this.folderNameInput.value.trim();
        const folderNumber = this.folderNumberInput.value.trim();
        let finalName = '';
        let allSubfolders = [];

        if (!onlySubfolders) {
            if (!folderName) {
                this.showNotification('Por favor, digite um nome para a pasta.', 'error');
                return;
            }

            const sanitizedName = this.sanitizeFolderName(folderName);
            if (!sanitizedName) {
                this.showNotification('Nome da pasta inválido. Use apenas letras, números e espaços.', 'error');
                return;
            }

            // Criar nome final com número
            finalName = sanitizedName;
            if (folderNumber) {
                const numberLength = folderNumber.length;
                const minLength = Math.max(3, numberLength);
                const formattedNumber = folderNumber.padStart(minLength, '0');
                finalName = `${formattedNumber}. ${sanitizedName}`;
            }

            // Subpastas dinâmicas
            const dynamicSubfolders = this.getDynamicSubfolders();
            allSubfolders = dynamicSubfolders.length > 0 ? dynamicSubfolders : [];
        } else {
            // Modo apenas subpastas
            allSubfolders = this.getDynamicSubfolders();
        }

        this.setLoadingState(true);

        try {
            // Mostrar notificação informativa
            this.showNotification('Abrindo diálogo para selecionar onde salvar...', 'info');
            
            // Aguardar um pouco para mostrar a notificação
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Esconder a notificação antes de abrir o diálogo
            this.hideNotification();
            
            // Abrir diálogo para selecionar onde salvar
            const folderHandle = await this.selectFolder();
            
            if (folderHandle) {
                if (onlySubfolders) {
                    await this.createSubfoldersOnly(folderHandle, allSubfolders);
                    this.showNotification(`Subpastas criadas com sucesso!`, 'success');
                } else {
                    await this.createFolderStructure(folderHandle, finalName, allSubfolders);
                    // Manter as informações no formulário para possível edição
                    this.updatePreview();
                    this.showNotification(`Pasta "${finalName}" criada com sucesso!`, 'success');
                }
            }
            // Nota: Se folderHandle for null, a função selectFolder() já mostrou uma notificação apropriada
            
        } catch (error) {
            this.showNotification('Erro ao criar as pastas. Tente novamente.', 'error');
            console.error('Erro ao criar pastas:', error);
        } finally {
            this.setLoadingState(false);
        }
    }

    async selectFolder() {
        try {
            // Verificar se a API File System Access está disponível
            if ('showDirectoryPicker' in window) {
                // Lista de opções de startIn para tentar em ordem
                const startInOptions = [
                    'desktop',
                    'documents', 
                    'downloads',
                    undefined // sem startIn
                ];
                
                // Tentar cada opção até uma funcionar
                for (const startIn of startInOptions) {
                    try {
                        const options = {
                            mode: 'readwrite'
                        };
                        
                        if (startIn) {
                            options.startIn = startIn;
                        }
                        
                        return await window.showDirectoryPicker(options);
                    } catch (startInError) {
                        console.warn(`Não foi possível iniciar em ${startIn || 'padrão'}, tentando próxima opção:`, startInError);
                        
                        // Se for o último item da lista, relançar o erro
                        if (startIn === undefined) {
                            throw startInError;
                        }
                        
                        // Continuar para próxima opção
                        continue;
                    }
                }
            } else {
                // Fallback para navegadores que não suportam a API
                this.showNotification('Seu navegador não suporta seleção de pastas. Use Chrome, Edge ou Firefox recente.', 'error');
                return null;
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                // Usuário cancelou a seleção
                this.showNotification('Seleção cancelada. Clique novamente para escolher onde salvar.', 'info');
                return null;
            }
            
            // Tratar erros específicos
            if (error.name === 'NotAllowedError') {
                this.showNotification('Acesso negado. Tente escolher uma pasta diferente (como Documentos ou Downloads).', 'error');
                return null;
            }
            
            if (error.name === 'SecurityError') {
                this.showNotification('Não é possível acessar esta pasta por motivos de segurança. Escolha uma pasta diferente.', 'error');
                return null;
            }
            
            // Erro genérico do diálogo
            if (error.message && error.message.includes('contém arquivos do sistema')) {
                this.showNotification('Esta pasta contém arquivos do sistema. Escolha uma pasta diferente como Documentos ou Downloads.', 'error');
                return null;
            }
            
            console.error('Erro ao selecionar pasta:', error);
            this.showNotification('Erro ao abrir o seletor de pasta. Tente novamente ou escolha uma pasta diferente.', 'error');
            return null;
        }
    }

    async createFolderStructure(parentHandle, folderName, subfoldersList = null) {
        try {
            // Criar a pasta principal
            const mainFolderHandle = await parentHandle.getDirectoryHandle(folderName, { create: true });
            
            // Se não houver subpastas dinâmicas, criar as fixas na pasta principal
            if (!subfoldersList || subfoldersList.length === 0) {
                for (const subfolder of this.subfolders) {
                    const subfolderHandle = await mainFolderHandle.getDirectoryHandle(subfolder, { create: true });
                    // Criar pasta _OLD dentro de cada subpasta fixa
                    await subfolderHandle.getDirectoryHandle('_OLD', { create: true });
                }
                console.log(`Estrutura de pastas criada: ${folderName}`);
                console.log('Subpastas fixas criadas:', this.subfolders);
            } else {
                // Se houver subpastas dinâmicas, criar as fixas dentro de cada uma
                for (const subfolder of subfoldersList) {
                    const subfolderHandle = await mainFolderHandle.getDirectoryHandle(subfolder, { create: true });
                    
                    // Criar as subpastas fixas dentro de cada subpasta personalizada
                    for (const fixedSubfolder of this.subfolders) {
                        const fixedSubfolderHandle = await subfolderHandle.getDirectoryHandle(fixedSubfolder, { create: true });
                        // Criar pasta _OLD dentro de cada subpasta fixa
                        await fixedSubfolderHandle.getDirectoryHandle('_OLD', { create: true });
                    }
                }
                console.log(`Estrutura de pastas criada: ${folderName}`);
                console.log('Subpastas personalizadas criadas:', subfoldersList);
                console.log('Subpastas fixas criadas dentro de cada subpasta personalizada:', this.subfolders);
            }
            
        } catch (error) {
            console.error('Erro ao criar estrutura de pastas:', error);
            throw new Error('Não foi possível criar as pastas. Verifique as permissões.');
        }
    }

    setLoadingState(loading) {
        if (loading) {
            this.saveBtn.classList.add('loading');
            this.saveBtn.disabled = true;
            this.saveBtn.innerHTML = '<span class="btn-icon">⏳</span> Selecione onde salvar...';
        } else {
            this.saveBtn.classList.remove('loading');
            this.saveBtn.disabled = false;
            this.saveBtn.innerHTML = '<span class="btn-icon">💾</span> Salvar Pastas';
        }
    }

    showNotification(message, type = 'success') {
        this.notificationMessage.textContent = message;
        this.notification.className = `notification ${type}`;
        this.notification.classList.remove('hidden');
        
        // Mostrar notificação
        setTimeout(() => {
            this.notification.classList.add('show');
        }, 100);

        // Esconder notificação após 4 segundos
        setTimeout(() => {
            this.notification.classList.remove('show');
            setTimeout(() => {
                this.notification.classList.add('hidden');
            }, 300);
        }, 4000);
    }

    hideNotification() {
        this.notification.classList.remove('show');
        setTimeout(() => {
            this.notification.classList.add('hidden');
        }, 300);
    }

    // Método para exportar a estrutura de pastas (útil para integração com backend)
    exportFolderStructure(folderName) {
        return {
            mainFolder: folderName,
            subfolders: this.subfolders,
            structure: {
                [folderName]: this.subfolders.reduce((acc, subfolder) => {
                    acc[subfolder] = [];
                    return acc;
                }, {})
            }
        };
    }

    async createSubfoldersOnly(parentHandle, subfoldersList) {
        try {
            // Se o usuário não adicionou subpastas dinâmicas, usamos as fixas
            const list = (subfoldersList && subfoldersList.length > 0) ? subfoldersList : this.subfolders;

            const isDynamic = list.some(sub => !this.subfolders.includes(sub));

            for (const subfolder of list) {
                const subfolderHandle = await parentHandle.getDirectoryHandle(subfolder, { create: true });

                if (isDynamic) {
                    // Dentro de cada subpasta dinâmica criar as subpastas fixas
                    for (const fixed of this.subfolders) {
                        const fixedHandle = await subfolderHandle.getDirectoryHandle(fixed, { create: true });
                        await fixedHandle.getDirectoryHandle('_OLD', { create: true });
                    }
                } else {
                    // Subpastas fixas diretamente: apenas criar _OLD dentro
                    await subfolderHandle.getDirectoryHandle('_OLD', { create: true });
                }
            }
        } catch (error) {
            console.error('Erro ao criar subpastas:', error);
            throw new Error('Não foi possível criar as subpastas. Verifique as permissões.');
        }
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new FolderOrganizer();
});

 