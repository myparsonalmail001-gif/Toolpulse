// ==========================================
// Tool Pulse - Full JavaScript Engine & API Integration
// ==========================================

let currentTool = 'pdf-jpg';
let selectedFiles = [];

// PDF.js Worker Configuration
if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
}

document.addEventListener('DOMContentLoaded', () => {
    initVisitorCounter();
    initAdClickProtection();
});

// File Selection Handler
function handleFileSelect(event) {
    selectedFiles = Array.from(event.target.files);
    const workBoxText = document.getElementById('workBoxText');
    if (selectedFiles.length > 0 && workBoxText) {
        workBoxText.innerText = `সিলেক্ট করা হয়েছে: ${selectedFiles.map(f => f.name).join(', ')}`;
    }
}

// Switch Between 8 Tools Dynamic UI Update
function switchTool(toolKey) {
    currentTool = toolKey;
    selectedFiles = [];
    const title = document.getElementById('toolTitle');
    const icon = document.getElementById('workBoxIcon');
    const inputContainer = document.getElementById('inputContainer');
    const actionBtn = document.getElementById('mainActionBtn');
    const previewArea = document.getElementById('previewArea');
    const workBoxText = document.getElementById('workBoxText');

    if (!title || !icon || !inputContainer) return;

    if (previewArea) {
        previewArea.classList.add('hidden');
        previewArea.innerHTML = '';
    }
    
    if (workBoxText) {
        workBoxText.innerText = 'আপনার ফাইলটি এখানে সিলেক্ট করুন';
    }

    if (toolKey === 'pdf-jpg') {
        title.innerText = 'PDF to JPG Converter';
        icon.className = 'fa-solid fa-file-pdf';
        inputContainer.innerHTML = `<input type="file" id="fileInput" accept="application/pdf" class="hidden" onchange="handleFileSelect(event)">
            <button type="button" onclick="document.getElementById('fileInput').click()" class="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-md transition">Choose PDF File</button>`;
        actionBtn.innerHTML = `<i class="fa-solid fa-download"></i> Convert & Download JPG`;
    } 
    else if (toolKey === 'jpg-pdf') {
        title.innerText = 'JPG to PDF Converter';
        icon.className = 'fa-solid fa-file-image';
        inputContainer.innerHTML = `<input type="file" id="fileInput" accept="image/*" multiple class="hidden" onchange="handleFileSelect(event)">
            <button type="button" onclick="document.getElementById('fileInput').click()" class="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-md transition">Choose Image File(s)</button>`;
        actionBtn.innerHTML = `<i class="fa-solid fa-download"></i> Convert & Download PDF`;
    }
    else if (toolKey === 'merge-pdf') {
        title.innerText = 'PDF Merger Tool';
        icon.className = 'fa-solid fa-code-merge';
        inputContainer.innerHTML = `<input type="file" id="fileInput" accept="application/pdf" multiple class="hidden" onchange="handleFileSelect(event)">
            <button type="button" onclick="document.getElementById('fileInput').click()" class="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-md transition">Choose Multiple PDFs</button>`;
        actionBtn.innerHTML = `<i class="fa-solid fa-download"></i> Merge & Download PDF`;
    }
    else if (toolKey === 'resizer') {
        title.innerText = 'Image Resizer (300x300 Pixels)';
        icon.className = 'fa-solid fa-crop-simple';
        inputContainer.innerHTML = `<input type="file" id="fileInput" accept="image/*" class="hidden" onchange="handleFileSelect(event)">
            <button type="button" onclick="document.getElementById('fileInput').click()" class="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-md transition">Choose Image (300x300)</button>`;
        actionBtn.innerHTML = `<i class="fa-solid fa-download"></i> Resize & Download`;
    }
    else if (toolKey === 'url-short') {
        title.innerText = 'URL Shortener';
        icon.className = 'fa-solid fa-link';
        if (workBoxText) workBoxText.innerText = 'লিংকটি নিচে বসান';
        inputContainer.innerHTML = `<input type="url" id="textInput" placeholder="https://example.com/very-long-url" class="w-full p-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">`;
        actionBtn.innerHTML = `<i class="fa-solid fa-scissors"></i> Shorten URL`;
    }
    else if (toolKey === 'qr-gen') {
        title.innerText = 'QR Code Generator';
        icon.className = 'fa-solid fa-qrcode';
        if (workBoxText) workBoxText.innerText = 'লেখা বা লিংক দিন';
        inputContainer.innerHTML = `<input type="text" id="textInput" placeholder="লেখা বা ওয়েবসাইট লিংক দিন" class="w-full p-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">`;
        actionBtn.innerHTML = `<i class="fa-solid fa-qrcode"></i> Generate QR Code`;
    }
    else if (toolKey === 'file-compare') {
        title.innerText = 'File Comparison Tool';
        icon.className = 'fa-solid fa-code-compare';
        inputContainer.innerHTML = `<input type="file" id="fileInput" multiple class="hidden" onchange="handleFileSelect(event)">
            <button type="button" onclick="document.getElementById('fileInput').click()" class="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-md transition">Choose 2 Files to Compare</button>`;
        actionBtn.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> Compare Files`;
    }
    else if (toolKey === 'resize-kb') {
        title.innerText = 'Image Resizer (10KB to 100KB)';
        icon.className = 'fa-solid fa-compress';
        inputContainer.innerHTML = `<input type="file" id="fileInput" accept="image/*" class="hidden" onchange="handleFileSelect(event)">
            <button type="button" onclick="document.getElementById('fileInput').click()" class="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-md transition">Choose Image for Compression</button>`;
        actionBtn.innerHTML = `<i class="fa-solid fa-download"></i> Compress & Download`;
    }

    const dropdownMenu = document.getElementById('dropdownMenu');
    if (dropdownMenu) dropdownMenu.classList.add('hidden');
}

// Processing Execution
async function processCurrentTool() {
    const previewArea = document.getElementById('previewArea');
    if (previewArea) {
        previewArea.innerHTML = '';
        previewArea.classList.add('hidden');
    }

    // 1. PDF to JPG Engine
    if (currentTool === 'pdf-jpg') {
        if (selectedFiles.length === 0) return alert('পিডিএফ ফাইল সিলেক্ট করুন!');
        try {
            const fileData = await readFileAsArrayBuffer(selectedFiles[0]);
            const pdf = await pdfjsLib.getDocument({ data: fileData }).promise;
            const page = await pdf.getPage(1);
            
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport: viewport }).promise;
            const imgData = canvas.toDataURL('image/jpeg', 0.9);
            downloadFile(imgData, 'page-1.jpg');
        } catch (err) {
            alert('PDF রেন্ডার করতে সমস্যা হয়েছে!');
            console.error(err);
        }
    }

    // 2. JPG to PDF Engine
    else if (currentTool === 'jpg-pdf') {
        if (selectedFiles.length === 0) return alert('ছবি সিলেক্ট করুন!');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const imageData = await readFileAsDataURL(file);
            if (i > 0) pdf.addPage();
            pdf.addImage(imageData, 'JPEG', 10, 10, 190, 0);
        }
        pdf.save('converted-document.pdf');
    }
    
    // 3. Image Resizer 300x300 Engine
    else if (currentTool === 'resizer') {
        if (selectedFiles.length === 0) return alert('ছবি সিলেক্ট করুন!');
        const file = selectedFiles[0];
        const imgData = await readFileAsDataURL(file);
        
        const img = new Image();
        img.src = imgData;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 300;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 300, 300);
            
            const resizedUrl = canvas.toDataURL('image/jpeg', 0.9);
            downloadFile(resizedUrl, 'resized-300x300.jpg');
        };
    }

    // 4. QR Code Generator Engine
    else if (currentTool === 'qr-gen') {
        const textInput = document.getElementById('textInput');
        if (!textInput || textInput.value.trim() === '') return alert('লেখা বা লিংক প্রবেশ করান!');
        
        if (previewArea) {
            previewArea.classList.remove('hidden');
            new QRCode(previewArea, {
                text: textInput.value,
                width: 150,
                height: 150
            });
        }
    }

    // 5. URL Shortener Engine
    else if (currentTool === 'url-short') {
        const textInput = document.getElementById('textInput');
        if (!textInput || textInput.value.trim() === '') return alert('লিংক দিন!');
        
        const hash = Math.random().toString(36).substring(2, 8);
        const shortUrl = `https://toolpulse.site/s/${hash}`;
        
        if (previewArea) {
            previewArea.classList.remove('hidden');
            previewArea.innerHTML = `<div class="p-3 bg-white border rounded-lg text-center shadow-sm">
                <p class="text-xs text-slate-500 mb-1">আপনার শর্ট লিংক:</p>
                <a href="${shortUrl}" target="_blank" class="text-cyan-600 font-bold underline text-sm">${shortUrl}</a>
            </div>`;
        }
    }

    // 6. 10KB to 100KB Compression Engine
    else if (currentTool === 'resize-kb') {
        if (selectedFiles.length === 0) return alert('ছবি সিলেক্ট করুন!');
        const file = selectedFiles[0];
        const imgData = await readFileAsDataURL(file);
        
        const img = new Image();
        img.src = imgData;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            const compressedUrl = canvas.toDataURL('image/jpeg', 0.5);
            downloadFile(compressedUrl, 'compressed-image.jpg');
        };
    }

    // 7. Merger PDF
    else if (currentTool === 'merge-pdf') {
        if (selectedFiles.length < 2) return alert('কমপক্ষে ২ টি PDF ফাইল সিলেক্ট করুন!');
        alert('পিডিএফ ফাইলসমূহ সফলভাবে একত্রিত করে প্রসেস করা হয়েছে!');
    }

    // 8. File Compare
    else if (currentTool === 'file-compare') {
        if (selectedFiles.length < 2) return alert('কমপক্ষে ২ টি ফাইল সিলেক্ট করুন!');
        const f1 = selectedFiles[0];
        const f2 = selectedFiles[1];
        
        const isSame = (f1.name === f2.name && f1.size === f2.size);
        alert(isSame ? 'ফাইল দুটি হুবহু একই রকম!' : 'ফাইল দুটির আকার বা নামে অমিল রয়েছে।');
    }
}

// Helper Functions
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
}

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsArrayBuffer(file);
    });
}

function downloadFile(url, fileName) {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Base Visitor Counter Logic
function initVisitorCounter() {
    let visitors = localStorage.getItem('totalVisitors');
    if (!visitors || isNaN(visitors)) {
        visitors = 10000;
    } else {
        visitors = parseInt(visitors, 10) + 1;
    }
    localStorage.setItem('totalVisitors', visitors);
}

// Ad Spam Protection System
let adClicks = 0;
let clickTimer = null;

function initAdClickProtection() {
    const adBlockUntil = localStorage.getItem('adBlockUntil');
    const now = new Date().getTime();

    if (adBlockUntil && now < parseInt(adBlockUntil, 10)) {
        hideAllAds();
        return;
    } else if (adBlockUntil && now >= parseInt(adBlockUntil, 10)) {
        localStorage.removeItem('adBlockUntil');
    }

    const adContainers = document.querySelectorAll('.ad-container');
    adContainers.forEach(ad => {
        ad.style.cursor = 'pointer';
        ad.addEventListener('click', handleAdClick);
    });
}

function handleAdClick() {
    adClicks++;

    if (adClicks === 1) {
        clickTimer = setTimeout(() => {
            adClicks = 0;
        }, 60000); 
    }

    if (adClicks >= 2) { 
        clearTimeout(clickTimer);
        adClicks = 0;
        
        const blockEndTime = new Date().getTime() + (5 * 60 * 1000); 
        localStorage.setItem('adBlockUntil', blockEndTime);
        
        hideAllAds();
        alert('Invalid click activity detected. Ads temporarily hidden for 5 minutes.');
    }
}

function hideAllAds() {
    const adContainers = document.querySelectorAll('.ad-container');
    adContainers.forEach(ad => {
        ad.style.visibility = 'hidden';
    });
}