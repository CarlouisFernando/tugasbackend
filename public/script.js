
//menu
$(document).ready(function(){
    var originalOrder = $(".product").toArray();
    
    var bestProductIndex = originalOrder.findIndex(function(product) {
        return $(product).find(".bannerbest").length > 0;
    });
    if (bestProductIndex !== -1) {
        var bestProduct = originalOrder.splice(bestProductIndex, 1);
        originalOrder.unshift(bestProduct[0]);
    }

    function sortAlphabetically() {
        var sortedProducts = sortProducts(function(a, b) {
            var textA = $(a).find("h3").text().toUpperCase();
            var textB = $(b).find("h3").text().toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        $(".shop-card").empty().append(sortedProducts);
    }

    function sortByPrice() {
        var sortedProducts = sortProducts(function(a, b) {
            var priceA = getPrice(a);
            var priceB = getPrice(b);
            return priceA - priceB;
        });
        $(".shop-card").empty().append(sortedProducts);
    }

    function sortByRec() {
        var sortedProducts = sortProducts(function(a, b) {
            var hasRecA = $(a).find(".banner").length > 0;
            var hasRecB = $(b).find(".banner").length > 0;
            return hasRecA === hasRecB ? 0 : hasRecA ? -1 : 1;
        });
        $(".shop-card").empty().append(sortedProducts);
    }

    function sortOriginal() {
        $(".shop-card").empty().append(originalOrder);
    }
    //untuk sort alphabet
    $("#sort-alpha").on("click", function() {
        sortAlphabetically();
    });
    // untuk sort harga
    $("#sort-price").on("click", function() {
        sortByPrice();
    });
    //untuk sort recommended
    $("#sort-rec").on("click", function() {
        sortByRec();
    });
    //untuk sort default
    $("#sort-original").on("click", function() {
        sortOriginal();
    });

    $("#search-bar").on("keyup", function() {
        var searchText = $(this).val().toUpperCase();
        var filteredProducts = originalOrder.filter(function(product) {
            var productName = $(product).find("h3").text().toUpperCase();
            return productName.includes(searchText);
        });
        $(".shop-card").empty().append(filteredProducts);
    });

    function getPrice(product) {
        var priceText = $(product).find(".price").text().replace(/[^\d.]/g, '');
        return parseFloat(priceText);
    }    

    function sortProducts(compareFunction) {
        var bestProduct = $(".product").find(".bannerbest").parent();
        var otherProducts = $(".product").not(bestProduct);
        var sortedProducts = otherProducts.toArray().sort(compareFunction);
        return [bestProduct].concat(sortedProducts);
    }
});

function filterSelection(category) {
    var products = document.getElementsByClassName("product");
    if (category === "all") {
        // Show all products
        for (var i = 0; i < products.length; i++) {
            products[i].style.display = "block";
        }
    } else {
        // Hide all products
        for (var i = 0; i < products.length; i++) {
            products[i].style.display = "none";
        }
        // Show products with selected category
        if (category === "recommended") {
            var recommendedProducts = document.querySelectorAll(".banner",".bannerbest");
            recommendedProducts.forEach(function(product) {
                product.parentNode.style.display = "block";
            });
        } else if (category === "above20000") {
            var above20000Products = document.querySelectorAll(".product");
            above20000Products.forEach(function(product) {
                var price = product.querySelector(".price").innerText;
                if (parseInt(price.replace(/\D/g, "")) > 20000) {
                    product.style.display = "block";
                }
            });
        } else if (category === "below20000") {
            var below20000Products = document.querySelectorAll(".product");
            below20000Products.forEach(function(product) {
                var price = product.querySelector(".price").innerText;
                if (parseInt(price.replace(/\D/g, "")) <= 20000) {
                    product.style.display = "block";
                }
            });
        }
    }
}

// Inisialisasi array untuk menyimpan produk di wishlist
var wishlist = [];

function setup(){
    let addToWishlistButtons = document.querySelectorAll(".but");
    for(let i = 0; i < addToWishlistButtons.length; i++){
        addToWishlistButtons[i].onclick = function(e){
            addItem(e); // Memanggil fungsi addItem saat tombol "Add to Wishlist" diklik
        }
    }
}

function addItem(e) {
    let productId = e.target.getAttribute("id"); // Mendapatkan ID produk dari atribut id tombol yang diklik
    if(!wishlist.find(element => element === productId)){
        let productDiv = e.target.parentNode; // Mendapatkan elemen parent dari tombol yang diklik

        let wishDiv = document.createElement("div");
        wishDiv.setAttribute("id", "wish" + productId);  // Menetapkan ID unik untuk elemen produk di wishlist
        wishDiv.setAttribute("class", "product");
        wishDiv.setAttribute("style", "margin-bottom: 10px;");
        wishDiv.innerHTML += productDiv.innerHTML; // Menyalin konten dari elemen produk ke dalam elemen wishlist

        let removeBtn = document.createElement("input");// Membuat tombol remove baru
        removeBtn.setAttribute("id", "remove" + productId);
        removeBtn.setAttribute("type", "button");
        removeBtn.setAttribute("value", "Remove");
        removeBtn.onclick = () => removeItem(productId);// Menambahkan event listener untuk menghapus item dari wishlist saat tombol remove diklik
        wishDiv.appendChild(removeBtn);

        let aside = document.getElementById("wishlist");
        aside.appendChild(wishDiv);

        wishlist.push(productId);// Menambahkan ID produk ke dalam array wishlist
    }
}

function removeItem(productId) {
    document.getElementById("wish" + productId).remove();  // Menghapus elemen produk dari wishlist
    wishlist = wishlist.filter(element => element !== productId);
}

window.addEventListener("load", setup); // Memanggil fungsi setup saat halaman dimuat

// FOOTER
document.addEventListener("DOMContentLoaded", function () {
    const footer = document.querySelectorAll('footer');
  
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.5 });
  
    footer.forEach(item => {
        observer.observe(item);
    });
});