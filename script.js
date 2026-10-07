let selectedPrice = 0;
let selectedProduct = "";

// NOMOR WHATSAPP PENJUAL
const sellerWhatsApp = "6281380023385";


// =========================
// TANGGAL PENGANTARAN
// =========================

// Ambil input tanggal pengantaran
const deliveryDateInput = document.getElementById("deliveryDate");

// Ambil tanggal hari ini
const today = new Date();

// Minimal pengantaran = BESOK
today.setDate(today.getDate() + 1);

// Format tanggal menjadi YYYY-MM-DD
const minDate =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

// Batasi tanggal agar tidak bisa memilih hari ini
// atau tanggal sebelumnya
deliveryDateInput.min = minDate;


// =========================
// BUKA FORM PEMESANAN
// =========================

function openOrder(product, price) {

    selectedProduct = product;
    selectedPrice = price;

    document.getElementById("productName").textContent = product;
    document.getElementById("product").value = product;

    // Reset jumlah
    document.getElementById("quantity").value = 10;

    // Reset tanggal pengantaran
    document.getElementById("deliveryDate").value = "";

    // Reset pembayaran
    document.getElementById("payment").value = "";

    document.getElementById("qrisBox").style.display = "none";
    document.getElementById("bankBox").style.display = "none";

    calculateTotal();

    // Tampilkan modal
    document.getElementById("orderModal").style.display = "block";

    document.body.style.overflow = "hidden";
}


// =========================
// TUTUP FORM
// =========================

function closeOrder() {

    document.getElementById("orderModal").style.display = "none";

    document.body.style.overflow = "auto";
}


// =========================
// HITUNG TOTAL
// =========================

function calculateTotal() {

    let quantity = parseInt(
        document.getElementById("quantity").value
    );

    if (isNaN(quantity) || quantity < 10) {
        quantity = 10;
    }

    let total = selectedPrice * quantity;

    document.getElementById("total").textContent =
        formatRupiah(total);
}


// =========================
// FORMAT RUPIAH
// =========================

function formatRupiah(number) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(number);
}


// =========================
// FORMAT TANGGAL INDONESIA
// =========================

function formatTanggal(tanggal) {

    const date = new Date(tanggal + "T00:00:00");

    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}


// =========================
// PILIH PEMBAYARAN
// =========================

function paymentDetail() {

    const payment =
        document.getElementById("payment").value;

    const qrisBox =
        document.getElementById("qrisBox");

    const bankBox =
        document.getElementById("bankBox");

    qrisBox.style.display = "none";
    bankBox.style.display = "none";

    if (payment === "QRIS") {
        qrisBox.style.display = "block";
    }

    if (payment === "Transfer Bank") {
        bankBox.style.display = "block";
    }
}


// =========================
// SUBMIT PESANAN
// =========================

document.getElementById("orderForm").addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value;

        const address =
            document.getElementById("address").value;

        const deliveryDate =
            document.getElementById("deliveryDate").value;

        const quantity =
            parseInt(
                document.getElementById("quantity").value
            );

        const payment =
            document.getElementById("payment").value;


        // =========================
        // CEK TANGGAL PENGANTARAN
        // =========================

        if (deliveryDate === "") {

            alert("Silakan pilih tanggal pengantaran.");

            return;
        }


        // Cek agar tanggal tidak kurang dari besok
        if (deliveryDate < minDate) {

            alert("Tanggal pengantaran minimal adalah besok.");

            return;
        }


        // =========================
        // CEK JUMLAH
        // =========================

        if (quantity < 10) {

            alert("Minimal pembelian adalah 10 pcs.");

            return;
        }


        // =========================
        // CEK PEMBAYARAN
        // =========================

        if (payment === "") {

            alert("Silakan pilih metode pembayaran.");

            return;
        }


        // =========================
        // HITUNG TOTAL
        // =========================

        const total =
            selectedPrice * quantity;


        // =========================
        // FORMAT TANGGAL
        // =========================

        const formattedDeliveryDate =
            formatTanggal(deliveryDate);


        // =========================
        // PESAN WHATSAPP
        // =========================

        const message =

`*PESANAN BARU - ROEMAHDARLOENG*

━━━━━━━━━━━━━━━━━━

*DATA PEMESAN*
Nama       : ${name}
Alamat     : ${address}
Tanggal    : ${formattedDeliveryDate}

*DETAIL PESANAN*
Produk     : ${selectedProduct}
Jumlah     : ${quantity} pcs
Harga/pcs  : ${formatRupiah(selectedPrice)}

*PEMBAYARAN*
Metode     : ${payment}

*TOTAL*
${formatRupiah(total)}

━━━━━━━━━━━━━━━━━━
Mohon diproses. Terima kasih 🙏`;


        // =========================
        // ENCODE PESAN
        // =========================

        const encodedMessage =
            encodeURIComponent(message);


        // =========================
        // BUKA WHATSAPP
        // =========================

        const whatsappURL =
            `https://wa.me/${sellerWhatsApp}?text=${encodedMessage}`;

        window.open(whatsappURL, "_blank");
    }
);


// =========================
// KLIK DI LUAR MODAL
// =========================

window.addEventListener("click", function (event) {

    const modal =
        document.getElementById("orderModal");

    if (event.target === modal) {

        closeOrder();
    }
});