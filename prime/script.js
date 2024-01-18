// Restante do seu código...

// Lógica para exibir a lista de produtos na página
function displayProductList(productList) {
    const productListContainer = $('#product-list');
    productListContainer.empty();

    productList.forEach(product => {
        const cardHTML = `
            <div class="card">
                <img src="${product.image || 'https://via.placeholder.com/150'}" class="card-img-top" alt="Imagem do Produto">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text"><strong>Categoria:</strong> ${product.category}</p>
                    <p class="card-text"><strong>Preço:</strong> $${product.price.toFixed(2)}</p>
                </div>
            </div>
        `;
        productListContainer.append(cardHTML);
    });
}

// Lógica para exibir os detalhes do produto na página
function showProductDetails(productName) {
    // Crie uma referência para o produto específico no Realtime Database
    const productRef = database.ref(`products/${productName}`);

    // Obter os detalhes do produto
    productRef.once('value').then(snapshot => {
        const product = snapshot.val();

        // Atualizar os detalhes do produto na página
        displayProductDetails(product);
    });
}

// Lógica para exibir os detalhes do produto na página
function displayProductDetails(product) {
    const productDetailsContainer = $('#product-details');
    const productDetailsHTML = `
        <p><strong>Nome:</strong> ${product.name}</p>
        <p><strong>Categoria:</strong> ${product.category}</p>
        <p><strong>Descrição:</strong> ${product.description || 'N/A'}</p>
        <p><strong>Preço:</strong> $${product.price.toFixed(2)}</p>
        <img src="${product.image || 'https://via.placeholder.com/150'}" alt="Imagem do Produto">
    `;
    productDetailsContainer.html(productDetailsHTML);

    // Exibir o contêiner de detalhes do produto
    $('#product-details-container').show();
}

// Lógica para adicionar um novo produto
$('#addProductForm').submit(function (e) {
    e.preventDefault();

    const productName = $('#productName').val();
    const productCategory = $('#productCategory').val();
    const productDescription = $('#productDescription').val();
    const productPrice = parseFloat($('#productPrice').val());
    const productImage = $('#productImage').val();

    const newProduct = {
        name: productName,
        category: productCategory,
        description: productDescription,
        price: productPrice,
        image: productImage
    };

    addOrUpdateProduct(newProduct);

    // Limpar o formulário e fechar o modal
    $(this)[0].reset();
    $('#addProductModal').modal('hide');
});
