class AIVisionIntegration {
    constructor(folderOrganizer) {
        this.folderOrganizer = folderOrganizer;
        
        // ⚠️ IMPORTANTE: Substitua pela sua chave API do OpenAI
        this.API_KEY = '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';
        
        this.dropzone = document.getElementById('dropzone');
        this.imageUpload = document.getElementById('imageUpload');
        this.processAllBtn = document.getElementById('processAllBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.imagesGallery = document.getElementById('imagesGallery');
        this.imagesList = document.getElementById('imagesList');
        this.imageCount = document.getElementById('imageCount');
        this.aiProgress = document.getElementById('aiProgress');
        this.progressText = document.getElementById('progressText');
        this.progressFill = document.querySelector('.progress-fill');
        
        this.images = []; // Array para armazenar múltiplas imagens
        this.currentProcessingIndex = 0;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Dropzone click - trigger file input
        this.dropzone.addEventListener('click', () => {
            this.imageUpload.click();
        });
        
        // Dropzone drag & drop
        this.dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropzone.classList.add('dragover');
        });
        
        this.dropzone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.dropzone.classList.remove('dragover');
        });
        
        this.dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropzone.classList.remove('dragover');
            
            const files = Array.from(e.dataTransfer.files);
            const imageFiles = files.filter(file => file.type.startsWith('image/'));
            
            if (imageFiles.length > 0) {
                imageFiles.forEach(file => this.handleImageUpload(file));
                this.folderOrganizer.showNotification(`${imageFiles.length} imagem(ns) adicionada(s)!`, 'success');
            } else {
                this.folderOrganizer.showNotification('Nenhuma imagem válida encontrada nos arquivos arrastados.', 'error');
            }
        });
        
        // File input change - suporte a múltiplas imagens
        this.imageUpload.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                files.forEach(file => this.handleImageUpload(file));
                // Limpar o input para permitir adicionar a mesma imagem novamente
                e.target.value = '';
            }
        });
        
        // Process all button
        this.processAllBtn.addEventListener('click', () => {
            this.processAllImagesWithAI();
        });
        
        // Clear all button
        this.clearAllBtn.addEventListener('click', () => {
            this.clearAllImages();
        });
        
        // API Key agora é fixa no código - não há mais input para salvar
        
        // Global paste shortcut (Ctrl+V)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'v' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                this.pasteFromClipboard();
            }
        });
        
        // Global paste event
        document.addEventListener('paste', (e) => {
            if (!e.target.matches('input, textarea')) {
                e.preventDefault();
                this.handlePasteEvent(e);
            }
        });
    }
    
    handleImageUpload(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.folderOrganizer.showNotification('Por favor, selecione apenas imagens válidas.', 'error');
            return;
        }
        
        // Validate file size (max 20MB)
        if (file.size > 20 * 1024 * 1024) {
            this.folderOrganizer.showNotification(`Imagem "${file.name}" muito grande. Tamanho máximo: 20MB.`, 'error');
            return;
        }
        
        // Check if image already exists
        if (this.images.some(img => img.name === file.name && img.size === file.size)) {
            this.folderOrganizer.showNotification(`Imagem "${file.name}" já foi adicionada.`, 'info');
            return;
        }
        
        const imageData = {
            id: Date.now() + Math.random(), // ID único
            file: file,
            name: file.name,
            size: file.size,
            status: 'pending', // pending, processing, completed, error
            dataUrl: null,
            result: null,
            error: null
        };
        
        // Add to images array
        this.images.push(imageData);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            imageData.dataUrl = e.target.result;
            this.renderImageItem(imageData);
            this.updateUI();
        };
        reader.readAsDataURL(file);
    }
    
    renderImageItem(imageData) {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.dataset.imageId = imageData.id;
        
        imageItem.innerHTML = `
            <img src="${imageData.dataUrl}" alt="${imageData.name}">
            <div class="image-item-controls">
                <span class="image-item-status ${imageData.status}">${this.getStatusText(imageData.status)}</span>
                <div>
                    <button class="process-single-btn" data-action="process">▶ Processar</button>
                    <button class="remove-image-btn" data-action="remove">✕</button>
                </div>
            </div>
        `;
        
        // Add event listeners
        const processBtn = imageItem.querySelector('.process-single-btn');
        const removeBtn = imageItem.querySelector('.remove-image-btn');
        
        processBtn.addEventListener('click', () => this.processSingleImage(imageData.id));
        removeBtn.addEventListener('click', () => this.removeImage(imageData.id));
        
        this.imagesList.appendChild(imageItem);
    }
    
    updateUI() {
        const imageCount = this.images.length;
        this.imageCount.textContent = imageCount;
        
        // Show/hide gallery and buttons
        if (imageCount > 0) {
            this.imagesGallery.classList.remove('hidden');
            this.processAllBtn.classList.remove('hidden');
            this.clearAllBtn.classList.remove('hidden');
        } else {
            this.imagesGallery.classList.add('hidden');
            this.processAllBtn.classList.add('hidden');
            this.clearAllBtn.classList.add('hidden');
        }
        
        // Update button states
        const hasPendingImages = this.images.some(img => img.status === 'pending');
        const hasProcessingImages = this.images.some(img => img.status === 'processing');
        
        this.processAllBtn.disabled = !hasPendingImages || hasProcessingImages;
        this.processAllBtn.textContent = hasProcessingImages ? 
            '⏳ Processando...' : 
            `🔍 Processar ${this.images.filter(img => img.status === 'pending').length} Imagem(ns)`;
    }
    
    getStatusText(status) {
        const statusTexts = {
            'pending': 'Aguardando',
            'processing': 'Processando...',
            'completed': 'Concluído',
            'error': 'Erro'
        };
        return statusTexts[status] || status;
    }
    
    removeImage(imageId) {
        // Remove from array
        this.images = this.images.filter(img => img.id !== imageId);
        
        // Remove from DOM
        const imageItem = document.querySelector(`[data-image-id="${imageId}"]`);
        if (imageItem) {
            imageItem.remove();
        }
        
        this.updateUI();
        
        if (this.images.length === 0) {
            this.folderOrganizer.showNotification('Todas as imagens foram removidas.', 'info');
        }
    }
    
    clearAllImages() {
        if (this.images.length === 0) return;
        
        const hasProcessing = this.images.some(img => img.status === 'processing');
        if (hasProcessing) {
            this.folderOrganizer.showNotification('Não é possível limpar enquanto há imagens sendo processadas.', 'error');
            return;
        }
        
        this.images = [];
        this.imagesList.innerHTML = '';
        this.updateUI();
        this.folderOrganizer.showNotification('Todas as imagens foram removidas.', 'info');
    }
    
    async pasteFromClipboard() {
        try {
            // Verificar se a API Clipboard está disponível
            if (!navigator.clipboard || !navigator.clipboard.read) {
                this.folderOrganizer.showNotification('Seu navegador não suporta colar da área de transferência. Use Chrome/Edge mais recente.', 'error');
                return;
            }
            
            // Ler itens do clipboard
            const clipboardItems = await navigator.clipboard.read();
            
            let imageFound = false;
            
            for (const clipboardItem of clipboardItems) {
                // Procurar por tipos de imagem
                const imageTypes = clipboardItem.types.filter(type => type.startsWith('image/'));
                
                if (imageTypes.length > 0) {
                    const imageType = imageTypes[0];
                    const blob = await clipboardItem.getType(imageType);
                    
                    // Criar um File a partir do blob
                    const file = new File([blob], `clipboard-${Date.now()}.png`, {
                        type: imageType,
                        lastModified: Date.now()
                    });
                    
                    // Processar como uma imagem normal
                    this.handleImageUpload(file);
                    imageFound = true;
                    
                    this.folderOrganizer.showNotification('Imagem colada com sucesso!', 'success');
                    break;
                }
            }
            
            if (!imageFound) {
                this.folderOrganizer.showNotification('Nenhuma imagem encontrada na área de transferência. Tire um print primeiro (Print Screen).', 'info');
            }
            
        } catch (error) {
            console.error('Erro ao colar da área de transferência:', error);
            
            if (error.name === 'NotAllowedError') {
                this.folderOrganizer.showNotification('Permissão negada para acessar área de transferência. Permita o acesso e tente novamente.', 'error');
            } else if (error.name === 'NotFoundError') {
                this.folderOrganizer.showNotification('Nenhuma imagem encontrada na área de transferência. Tire um print primeiro (Print Screen).', 'info');
            } else {
                this.folderOrganizer.showNotification('Erro ao colar imagem. Tente tirar um print e colar novamente.', 'error');
            }
        }
    }
    
    handlePasteEvent(event) {
        const items = event.clipboardData?.items;
        if (!items) return;
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (file) {
                    // Renomear arquivo com timestamp
                    const newFile = new File([file], `pasted-${Date.now()}.png`, {
                        type: file.type,
                        lastModified: Date.now()
                    });
                    
                    this.handleImageUpload(newFile);
                    this.folderOrganizer.showNotification('Imagem colada com sucesso!', 'success');
                    return;
                }
            }
        }
        
        this.folderOrganizer.showNotification('Nenhuma imagem encontrada. Tire um print primeiro (Print Screen).', 'info');
    }
    
    async processSingleImage(imageId) {
        const imageData = this.images.find(img => img.id === imageId);
        if (!imageData) return;
        
        if (!this.API_KEY || this.API_KEY === 'sk-COLE_SUA_CHAVE_AQUI') {
            this.folderOrganizer.showNotification('Configure sua chave API do OpenAI no código JavaScript (script.js).', 'error');
            return;
        }
        
        // Para processamento individual, sempre limpar subpastas existentes
        await this.processImageWithAI(imageData, true);
    }
    
    async processAllImagesWithAI() {
        if (!this.API_KEY || this.API_KEY === 'sk-COLE_SUA_CHAVE_AQUI') {
            this.folderOrganizer.showNotification('Configure sua chave API do OpenAI no código JavaScript (script.js).', 'error');
            return;
        }
        
        const pendingImages = this.images.filter(img => img.status === 'pending');
        if (pendingImages.length === 0) {
            this.folderOrganizer.showNotification('Nenhuma imagem pendente para processar.', 'info');
            return;
        }
        
        this.showProgress('Iniciando processamento...');
        
        let processedCount = 0;
        let successCount = 0;
        let errorCount = 0;
        let totalSubfoldersAdded = 0;
        
        for (const imageData of pendingImages) {
            try {
                this.updateProgress(
                    (processedCount / pendingImages.length) * 90, 
                    `Processando ${imageData.name}... (${processedCount + 1}/${pendingImages.length})`
                );
                
                // Primeira imagem limpa as subpastas existentes, demais apenas adicionam
                const shouldClearExisting = (processedCount === 0);
                const subfoldersBeforeCount = this.folderOrganizer.dynamicSubfolders.length;
                
                await this.processImageWithAI(imageData, shouldClearExisting);
                
                const subfoldersAfterCount = this.folderOrganizer.dynamicSubfolders.length;
                const subfoldersAddedFromThisImage = subfoldersAfterCount - (shouldClearExisting ? 0 : subfoldersBeforeCount);
                totalSubfoldersAdded += subfoldersAddedFromThisImage;
                
                successCount++;
            } catch (error) {
                console.error(`Erro ao processar ${imageData.name}:`, error);
                errorCount++;
            }
            
            processedCount++;
        }
        
        this.updateProgress(100, 'Concluído!');
        
        setTimeout(() => {
            this.hideProgress();
            
            if (successCount > 0 && errorCount === 0) {
                const totalSubfolders = this.folderOrganizer.dynamicSubfolders.length;
                this.folderOrganizer.showNotification(
                    `${successCount} imagem(ns) processada(s)! ${totalSubfolders} subpasta(s) criada(s).`, 
                    'success'
                );
            } else if (successCount > 0 && errorCount > 0) {
                const totalSubfolders = this.folderOrganizer.dynamicSubfolders.length;
                this.folderOrganizer.showNotification(
                    `${successCount} processada(s), ${errorCount} com erro. ${totalSubfolders} subpasta(s) criada(s).`, 
                    'info'
                );
            } else {
                this.folderOrganizer.showNotification(`Erro ao processar todas as ${pendingImages.length} imagem(ns).`, 'error');
            }
        }, 1000);
    }
    
    async processImageWithAI(imageData, shouldClearExisting = true) {
        // Update status
        this.updateImageStatus(imageData.id, 'processing');
        
        try {
            this.showProgress('Convertendo imagem...');
            
            // Convert image to base64
            const base64Image = imageData.dataUrl;
            
            this.updateProgress(30, 'Enviando para OpenAI...');
            
            // Prepare the request
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [
                        {
                            role: 'system',
                            content: 'Você é um assistente especializado em extrair informações de estruturas de pastas em imagens com MÁXIMA PRECISÃO. Você é expert em reconhecer diferentes tipos de numeração (inteiros, decimais, letras, símbolos) e preservar texto em português com acentos. Sempre retorne apenas JSON válido, sem formatação markdown ou explicações.'
                        },
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'text',
                                    text: `Analise esta imagem e extraia informações sobre pastas/diretórios com MÁXIMA PRECISÃO. 
                                    
                                    ⭐ TÍTULO PRINCIPAL COM "#" (PRIORIDADE ABSOLUTA):
                                    - Se encontrar texto com "#" seguido de número e título (ex: "#6287 · FUNCIONALIDADE UNLOCK SURPRISE"), este é SEMPRE o título principal
                                    - Use APENAS o número após "#" para o campo "number" da pasta principal
                                    - Use APENAS o texto após "·" ou "-" para o campo "name" da pasta principal
                                    - Este título NUNCA deve ir para subpastas, sempre para mainFolder
                                    
                                    📋 SUBPASTAS - PROCURE POR TODOS OS TIPOS DE NUMERAÇÃO:
                                    1. NÚMEROS INTEIROS: "1. DESIGN", "2. DESENVOLVIMENTO", "3. MARKETING"
                                    2. NÚMEROS DECIMAIS: "6.1 PRODUCAO PASTA FICHARIO", "6.2 ANALISE COMPETITIVA", "1.1 BRIEFING"
                                    3. NÚMEROS COM LETRAS: "1a. PRIMEIRA VERSÃO", "1b. SEGUNDA VERSÃO"
                                    4. NÚMEROS ROMANOS: "I. PLANEJAMENTO", "II. EXECUÇÃO", "III. ENTREGA"
                                    5. LETRAS: "A. CONCEITO", "B. DESENVOLVIMENTO", "C. FINALIZAÇÃO"
                                    6. BULLET POINTS: "• ITEM UM", "- ITEM DOIS", "→ ITEM TRÊS"
                                    
                                    🔍 EXEMPLOS DE DETECÇÃO DE DIFERENTES FORMATOS:
                                    - "6.1 PRODUCAO PASTA FICHARIO" → {"number":"6.1", "name":"PRODUCAO PASTA FICHARIO"}
                                    - "1.2 BRIEFING E REFERENCIAS" → {"number":"1.2", "name":"BRIEFING E REFERENCIAS"}
                                    - "A. CONCEITO INICIAL" → {"number":"A", "name":"CONCEITO INICIAL"}
                                    - "• PRIMEIRA ETAPA" → {"number":"1", "name":"PRIMEIRA ETAPA"}
                                    - "→ DESENVOLVIMENTO" → {"number":"2", "name":"DESENVOLVIMENTO"}
                                    
                                    📝 REGRAS DE LIMPEZA E FORMATAÇÃO:
                                    - REMOVA completamente texto entre aspas: "texto" → (remover)
                                    - REMOVA completamente texto entre parênteses: (MKT) → (remover)  
                                    - REMOVA completamente texto entre colchetes: [CÓDIGO] → (remover)
                                    - REMOVA completamente texto entre chaves: {CATEGORIA} → (remover)
                                    - PRESERVE acentos e caracteres especiais em português
                                    - MANTENHA texto em maiúsculas como está
                                    - CAPTURE TODOS os números visíveis, mesmo decimais
                                    
                                    ✅ EXEMPLO COMPLETO COM DIFERENTES NUMERAÇÕES:
                                    Se a imagem tiver:
                                    "#6287 · FUNCIONALIDADE UNLOCK SURPRISE"
                                    "1. STORY E ANUNCIO ADS"
                                    "2. REELS E ANUNCIO ADS VOICE OVER"
                                    "6.1 PRODUCAO PASTA FICHARIO"
                                    "6.2 ANALISE COMPETITIVA"
                                    "A. CONCEITO INICIAL"
                                    "• BRIEFING CLIENTE"
                                    
                                    Retorne:
                                    {"mainFolder":{"number":"6287","name":"FUNCIONALIDADE UNLOCK SURPRISE"},"subfolders":[{"number":"1","name":"STORY E ANUNCIO ADS"},{"number":"2","name":"REELS E ANUNCIO ADS VOICE OVER"},{"number":"6.1","name":"PRODUCAO PASTA FICHARIO"},{"number":"6.2","name":"ANALISE COMPETITIVA"},{"number":"A","name":"CONCEITO INICIAL"},{"number":"1","name":"BRIEFING CLIENTE"}]}
                                    
                                    🚨 IMPORTANTE: 
                                    - Títulos com "#" são SEMPRE para mainFolder, nunca para subfolders!
                                    - CAPTURE TODOS os itens numerados/listados, mesmo com numeração diferente
                                    - NÃO IGNORE números decimais como 6.1, 6.2, etc.
                                    - SEJA PRECISO com acentos e caracteres especiais
                                    
                                    Retorne apenas JSON válido, sem markdown ou explicações.
                                    Se não encontrar informações: {"mainFolder":null,"subfolders":[]}`
                                },
                                {
                                    type: 'image_url',
                                    image_url: {
                                        url: base64Image
                                    }
                                }
                            ]
                        }
                    ],
                    max_tokens: 800,
                    temperature: 0.1,
                    response_format: { type: "json_object" }
                })
            });
            
            this.updateProgress(70, 'Processando resposta...');
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Erro na API do OpenAI');
            }
            
            const data = await response.json();
            let aiResponse = data.choices[0].message.content;
            
            console.log('Resposta original da IA:', aiResponse);
            console.log('Tipo da resposta:', typeof aiResponse);
            
            this.updateProgress(90, 'Preenchendo formulário...');
            
            // Clean the response - remove markdown formatting if present
            aiResponse = aiResponse.trim();
            
            // Remove markdown code blocks if present
            if (aiResponse.startsWith('```json')) {
                console.log('Removendo formatação ```json');
                aiResponse = aiResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
            }
            if (aiResponse.startsWith('```')) {
                console.log('Removendo formatação ```');
                aiResponse = aiResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
            }
            
            // Remove any remaining backticks
            aiResponse = aiResponse.replace(/`/g, '');
            
            // Trim again after cleaning
            aiResponse = aiResponse.trim();
            
            console.log('Resposta da IA após limpeza:', aiResponse);
            console.log('Comprimento da resposta:', aiResponse.length);
            
            // Parse the JSON response
            let folderData;
            try {
                folderData = JSON.parse(aiResponse);
            } catch (jsonError) {
                console.error('Erro ao fazer parse do JSON:', jsonError);
                console.error('Resposta da IA:', aiResponse);
                
                // Tentar encontrar JSON válido na resposta
                const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    try {
                        folderData = JSON.parse(jsonMatch[0]);
                        console.log('JSON recuperado com sucesso:', folderData);
                    } catch (secondError) {
                        throw new Error('Não foi possível extrair informações válidas da imagem. Tente uma imagem mais clara ou com texto mais legível.');
                    }
                } else {
                    throw new Error('A IA não retornou um formato válido. Tente novamente com uma imagem mais clara.');
                }
            }
            
            // Validate the structure
            if (!folderData || (typeof folderData !== 'object')) {
                throw new Error('Estrutura de resposta inválida. Tente novamente.');
            }
            
            // Log extracted data for debugging
            console.log('📋 Dados extraídos da IA:');
            console.log('  📁 Pasta Principal:', folderData.mainFolder);
            console.log('  📂 Subpastas:', folderData.subfolders);
            console.log('  📊 Total de subpastas encontradas:', folderData.subfolders ? folderData.subfolders.length : 0);
            
            // Log each subfolder for detailed debugging
            if (folderData.subfolders && folderData.subfolders.length > 0) {
                console.log('  📂 Detalhes das subpastas:');
                folderData.subfolders.forEach((subfolder, index) => {
                    console.log(`    ${index + 1}. Número: "${subfolder.number}", Nome: "${subfolder.name}"`);
                });
            }
            
            // Fill the form with extracted data
            this.fillFormWithData(folderData, shouldClearExisting);
            
            this.updateProgress(100, 'Concluído!');
            
            // Update image status to completed
            this.updateImageStatus(imageData.id, 'completed');
            
            setTimeout(() => {
                this.hideProgress();
                const action = shouldClearExisting ? 'substituídas' : 'adicionadas';
                this.folderOrganizer.showNotification(`Informações ${action} com sucesso!`, 'success');
            }, 1000);
            
        } catch (error) {
            console.error('Erro ao processar imagem:', error);
            this.hideProgress();
            
            // Mensagens de erro mais específicas
            let errorMessage = error.message;
            
            if (error.message.includes('JSON')) {
                errorMessage = 'Não foi possível processar a resposta da IA. Tente novamente com uma imagem mais clara.';
            } else if (error.message.includes('401')) {
                errorMessage = 'Chave API inválida. Verifique se a chave está correta e tem créditos disponíveis.';
            } else if (error.message.includes('429')) {
                errorMessage = 'Muitas requisições. Aguarde alguns segundos e tente novamente.';
            } else if (error.message.includes('403')) {
                errorMessage = 'Acesso negado. Verifique sua chave API e créditos na conta OpenAI.';
            }
            
            this.folderOrganizer.showNotification(`Erro: ${errorMessage}`, 'error');
            
            // Update image status to error
            this.updateImageStatus(imageData.id, 'error', errorMessage);
        }
    }
    
    updateImageStatus(imageId, status, error = null) {
        const imageData = this.images.find(img => img.id === imageId);
        if (!imageData) return;
        
        imageData.status = status;
        imageData.error = error;
        
        // Update UI
        const imageItem = document.querySelector(`[data-image-id="${imageId}"]`);
        if (imageItem) {
            const statusElement = imageItem.querySelector('.image-item-status');
            if (statusElement) {
                statusElement.textContent = this.getStatusText(status);
                statusElement.className = `image-item-status ${status}`;
            }
            
            // Update buttons
            const processBtn = imageItem.querySelector('.process-single-btn');
            if (processBtn) {
                processBtn.disabled = status === 'processing';
                processBtn.textContent = status === 'processing' ? '⏳' : 
                                       status === 'completed' ? '✅' : 
                                       status === 'error' ? '❌' : '▶ Processar';
            }
        }
        
        // Update main UI
        this.updateUI();
        
        // Mark as completed and save result
        if (status === 'completed') {
            imageData.result = 'processed';
        }
    }
    

    
    fillFormWithData(folderData, shouldClearExisting = true) {
        // Fill main folder data (only if not already filled)
        if (folderData.mainFolder) {
            if (folderData.mainFolder.number && !this.folderOrganizer.folderNumberInput.value) {
                this.folderOrganizer.folderNumberInput.value = folderData.mainFolder.number;
            }
            if (folderData.mainFolder.name && !this.folderOrganizer.folderNameInput.value) {
                this.folderOrganizer.folderNameInput.value = folderData.mainFolder.name.toUpperCase();
            }
        }
        
        // Clear existing subfolders only if specified (first image or manual processing)
        if (shouldClearExisting) {
            this.folderOrganizer.subfoldersInputs.innerHTML = '';
            this.folderOrganizer.dynamicSubfolders = [];
        }
        
        // Add subfolders (avoiding duplicates)
        if (folderData.subfolders && folderData.subfolders.length > 0) {
            folderData.subfolders.forEach(subfolder => {
                // Check if subfolder already exists
                const existingSubfolder = this.folderOrganizer.dynamicSubfolders.find(
                    existing => existing.name.toUpperCase() === subfolder.name.toUpperCase()
                );
                
                if (!existingSubfolder) {
                    this.folderOrganizer.addDynamicSubfolderInput(subfolder.name, subfolder.number);
                }
            });
        }
        
        // Update preview
        this.folderOrganizer.updatePreview();
    }
    
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    
    showProgress(text) {
        this.progressText.textContent = text;
        this.progressFill.style.width = '0%';
        this.aiProgress.classList.remove('hidden');
    }
    
    updateProgress(percent, text) {
        this.progressFill.style.width = `${percent}%`;
        this.progressText.textContent = text;
    }
    
    hideProgress() {
        this.aiProgress.classList.add('hidden');
    }
    
    // Métodos saveApiKey e loadSavedApiKey removidos - API Key agora é fixa no código
}

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
        this.currentSubfolderNumber = 0; // Para rastrear a numeração automática
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupGlobalKeyboardNavigation();
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

    setupGlobalKeyboardNavigation() {
        // Listener global para navegação por teclado
        document.addEventListener('keydown', (e) => {
            const activeRow = this.subfoldersInputs.querySelector('.subfolder-row.keyboard-movable');
            
            if (activeRow && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
                e.preventDefault();
                
                if (e.key === 'ArrowUp') {
                    this.moveSubfolderUp(activeRow);
                } else if (e.key === 'ArrowDown') {
                    this.moveSubfolderDown(activeRow);
                }
            }
        });
    }

    updatePreview() {
        const onlySubfolders = this.onlySubfoldersSwitch && this.onlySubfoldersSwitch.checked;
        
        if (onlySubfolders) {
            // Modo "apenas subpastas" - mostrar texto fixo com estilo desativado
            this.previewFolderName.textContent = 'Salvar apenas subpastas';
            this.previewFolderName.classList.add('inactive');
            
            // Aplicar estilo desativado ao item da pasta principal
            const mainFolderItem = document.querySelector('.folder-item:not(.subfolder)');
            if (mainFolderItem) {
                mainFolderItem.classList.add('inactive');
            }
            
            this.updateSubfoldersPreview();
            return;
        } else {
            // Remover classe inactive quando não está no modo apenas subpastas
            this.previewFolderName.classList.remove('inactive');
            
            // Remover estilo desativado do item da pasta principal
            const mainFolderItem = document.querySelector('.folder-item:not(.subfolder)');
            if (mainFolderItem) {
                mainFolderItem.classList.remove('inactive');
            }
        }
        
        // Modo normal - usar nome digitado
        const folderName = this.folderNameInput.value.trim();
        const folderNumber = this.folderNumberInput.value.trim();
        const sanitizedName = this.sanitizeFolderName(folderName);
        
        let finalName = sanitizedName || 'NOME DA PASTA';
        
        // Se há número digitado, usar ele. Se não, usar 0001 por padrão
        const numberToUse = folderNumber || '0001';
        
        // Formatar número com zeros à esquerda baseado no tamanho
        const numberLength = numberToUse.length;
        const minLength = Math.max(4, numberLength); // Mínimo 4 dígitos para mostrar 0001
        const formattedNumber = numberToUse.padStart(minLength, '0');
        finalName = `${formattedNumber}. ${finalName}`;
        
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
                    // Usar o número como está, sem zeros à esquerda
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

    getNextSubfolderNumber() {
        // Obter todos os números existentes
        const existingNumbers = [];
        const rows = this.subfoldersInputs.querySelectorAll('.subfolder-row');
        
        rows.forEach(row => {
            const numberInput = row.querySelector('.subfolder-number');
            if (numberInput && numberInput.value.trim()) {
                const num = parseInt(numberInput.value.trim());
                if (!isNaN(num)) {
                    existingNumbers.push(num);
                }
            }
        });
        
        // Se não há números existentes, começar do 0
        if (existingNumbers.length === 0) {
            return 0;
        }
        
        // Encontrar o maior número e adicionar 1
        const maxNumber = Math.max(...existingNumbers);
        return maxNumber + 1;
    }

    addDynamicSubfolderInput(name = '', number = null) {
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
        numberInput.placeholder = '0';
        numberInput.min = '0';
        numberInput.style.textTransform = 'none';
        numberInput.className = 'subfolder-number';
        
        // Usar número fornecido ou pegar o próximo número na sequência
        const nextNumber = number || this.getNextSubfolderNumber();
        numberInput.value = nextNumber;
        
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
        nameInput.value = name.toUpperCase();
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
                    this.updateSubfolderNumbering(); // Atualizar numeração após remoção
                }
            }, 10);
        });

        // Event listeners para atualizar preview
        numberInput.addEventListener('input', () => {
            this.updateSubfoldersPreview();
        });
        
        // Event listener para recalcular sequência quando o usuário muda um número
        numberInput.addEventListener('change', () => {
            // Pequeno delay para evitar conflitos ao digitar rapidamente
            setTimeout(() => {
                this.updateSubfolderNumbering();
            }, 100);
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

        // Event listeners para movimento com teclado
        this.setupKeyboardNavigation(row);

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

    updateSubfolderNumbering() {
        // Esta função é chamada quando o usuário muda manualmente um número
        // Atualiza a numeração automática para continuar a partir do maior número existente
        const rows = this.subfoldersInputs.querySelectorAll('.subfolder-row');
        const existingNumbers = [];
        
        rows.forEach(row => {
            const numberInput = row.querySelector('.subfolder-number');
            if (numberInput && numberInput.value.trim()) {
                const num = parseInt(numberInput.value.trim());
                if (!isNaN(num)) {
                    existingNumbers.push(num);
                }
            }
        });
        
        // Atualizar a numeração atual para o próximo número disponível
        if (existingNumbers.length > 0) {
            this.currentSubfolderNumber = Math.max(...existingNumbers) + 1;
        } else {
            this.currentSubfolderNumber = 0;
        }
    }

    setupKeyboardNavigation(row) {
        // Quando o mouse entra no card
        row.addEventListener('mouseenter', () => {
            this.setActiveKeyboardRow(row);
        });

        // Quando o mouse sai do card
        row.addEventListener('mouseleave', () => {
            // Só remove a classe se não estiver sendo movido ativamente
            if (!row.dataset.isActiveKeyboard) {
                row.classList.remove('keyboard-movable');
            }
        });
    }

    setActiveKeyboardRow(row) {
        // Remover classe de todos os outros cards
        const allRows = this.subfoldersInputs.querySelectorAll('.subfolder-row');
        allRows.forEach(r => {
            if (r !== row) {
                r.classList.remove('keyboard-movable');
                delete r.dataset.isActiveKeyboard;
                // Limpar timer anterior
                if (r.keyboardFocusTimer) {
                    clearTimeout(r.keyboardFocusTimer);
                    delete r.keyboardFocusTimer;
                }
            }
        });
        
        // Adicionar classe ao card ativo
        row.classList.add('keyboard-movable');
        row.dataset.isActiveKeyboard = 'true';
    }

    moveSubfolderUp(row) {
        const previousRow = row.previousElementSibling;
        if (previousRow) {
            // Feedback visual de movimento
            row.classList.add('keyboard-moving');
            
            row.parentNode.insertBefore(row, previousRow);
            this.updateRowIndices();
            this.updateSubfoldersPreview();
            
            // Manter o foco no card que foi movido
            this.setActiveKeyboardRow(row);
            this.maintainKeyboardFocus(row);
            
            // Remover classe de movimento após animação
            setTimeout(() => {
                row.classList.remove('keyboard-moving');
            }, 200);
        }
    }

    moveSubfolderDown(row) {
        const nextRow = row.nextElementSibling;
        if (nextRow) {
            // Feedback visual de movimento
            row.classList.add('keyboard-moving');
            
            row.parentNode.insertBefore(nextRow, row);
            this.updateRowIndices();
            this.updateSubfoldersPreview();
            
            // Manter o foco no card que foi movido
            this.setActiveKeyboardRow(row);
            this.maintainKeyboardFocus(row);
            
            // Remover classe de movimento após animação
            setTimeout(() => {
                row.classList.remove('keyboard-moving');
            }, 200);
        }
    }

    maintainKeyboardFocus(row) {
        // Garantir que o card movido continue com foco para teclado
        row.dataset.isActiveKeyboard = 'true';
        row.classList.add('keyboard-movable');
        
        // Configurar um timer para remover o foco após um tempo sem movimento
        if (row.keyboardFocusTimer) {
            clearTimeout(row.keyboardFocusTimer);
        }
        
        row.keyboardFocusTimer = setTimeout(() => {
            // Verificar se o mouse não está mais sobre o card
            if (!row.matches(':hover')) {
                row.classList.remove('keyboard-movable');
                delete row.dataset.isActiveKeyboard;
            }
        }, 2000); // Remove o foco após 2 segundos de inatividade
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
            this.updateSubfolderNumbering();
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
                // Usar o número como está, sem zeros à esquerda
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
    const folderOrganizer = new FolderOrganizer();
    const aiIntegration = new AIVisionIntegration(folderOrganizer);
});

 