const scriptURL = "https://docs.google.com/spreadsheets/d/1J2Bzhp0gjzRMdXgjxvqzEieQ2zAIbi0xN8Nw-y1_A00/edit?usp=sharing";

document.getElementById("ppdbForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    
    // UI Feedback: Ubah tombol saat loading
    const btnSubmit = document.getElementById("btnSubmit");
    const statusDiv = document.getElementById("status");
    
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = "MENGIRIM DATA... ⏳";
    statusDiv.style.display = "none";
    statusDiv.className = "";

    const fileInput = document.getElementById("file");
    const file = fileInput.files[0];

    let base64 = "";
    let fileName = "";
    let fileType = "";

    if (file) {
        try {
            base64 = await toBase64(file);
            base64 = base64.split(",")[1];
            fileName = file.name;
            fileType = file.type;
        } catch (error) {
            showStatus("Gagal membaca file berkas!", "error");
            resetButton(btnSubmit);
            return;
        }
    }

    const data = {
        jenisPendaftaran: "Baru",
        nama: document.getElementById("nama").value,
        jk: document.getElementById("jk").value,
        nik: document.getElementById("nik").value,
        tempatLahir: document.getElementById("tempatLahir").value,
        tanggalLahir: document.getElementById("tanggalLahir").value,
        agama: document.getElementById("agama").value,
        alamat: document.getElementById("alamat").value,
        asalSekolah: document.getElementById("asalSekolah").value,
        pilihan1: document.getElementById("pilihan1").value,
        pilihan2: document.getElementById("pilihan2").value,
        email: document.getElementById("email").value,
        file: base64,
        fileName: fileName,
        fileType: fileType
    };

    fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        if(res.result === "success") {
            showStatus("🎉 Pendaftaran berhasil terkirim!", "success");
            
            const nama = document.getElementById("nama").value;
            const pesan = `Assalamu'alaikum, saya telah melakukan pendaftaran online PPDB PKBM Celah Cahaya 2026.%0A%0ANama: *${nama}*%0AStatus: *Pendaftaran Berhasil*%0A%0AMohon info selanjutnya. Terima kasih.`;
            
            // Buka WhatsApp di tab baru
            window.open(`https://wa.me/6281223546686?text=${pesan}`, "_blank");
            
            // Reset form
            document.getElementById("ppdbForm").reset();
        } else {
            throw new Error(res.message || "Unknown Error");
        }
    })
    .catch(err => {
        showStatus("Terjadi kesalahan sistem. Coba lagi nanti.", "error");
        console.error(err);
    })
    .finally(() => {
        resetButton(btnSubmit);
    });
});

// Helper Functions
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function showStatus(message, type) {
    const statusDiv = document.getElementById("status");
    statusDiv.innerHTML = message;
    statusDiv.className = type === "success" ? "status-success" : "status-error";
}

function resetButton(btn) {
    btn.disabled = false;
    btn.innerHTML = "DAFTAR SEKARANG";
}
