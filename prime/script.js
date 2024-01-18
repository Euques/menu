// Configurar as credenciais do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCLEyAd_4-2n2ID0xTjwS1ouip9G9C6JDs",
    authDomain: "blacknight-600de.firebaseapp.com",
    databaseURL: "https://blacknight-600de.firebaseio.com",
    projectId: "blacknight-600de",
    storageBucket: "blacknight-600de.appspot.com",
    messagingSenderId: "588926432348",
    appId: "1:588926432348:web:47b2b4a1b421d4b2a0e299",
    measurementId: "G-559VYPVJ5Q"
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);

// Restante do código permanece o mesmo



// Referência ao banco de dados
const database = firebase.database();

// Lógica para carregar a lista de categorias usando Realtime Database
function loadCategoryList() {
    const categoriesRef = database.ref('categories');

    categoriesRef.once('value').then(snapshot => {
        const categories = [];
        snapshot.forEach(childSnapshot => {
            const category = childSnapshot.val();
            categories.push(category);
        });

        displayCategoryList(categories);
    });
}

// Lógica para exibir a lista de categorias na página
function displayCategoryList(categories) {
    const categoryListContainer = $('#category-list');
    const categoryHTML = '<ul class="list-group">';
    categories.forEach(category => {
        categoryHTML += `<li class="list-group-item">${category.name}</li>`;
    });
    categoryHTML += '</ul>';
    categoryListContainer.html(categoryHTML);

    // Atualizar o dropdown de categorias no formulário de adição de produtos
    const categorySelect = $('#productCategory');
    categorySelect.empty();
    categorySelect.append('<option value="" selected>Selecione uma categoria</option>');
    categories.forEach(category => {
        categorySelect.append(`<option value="${category.name}">${category.name}</option>`);
    });
}

// Lógica para adicionar uma nova categoria
$('#addCategoryForm').submit(function (e) {
    e.preventDefault();

    const categoryName = $('#categoryName').val();

    if (categoryName.trim() !== "") {
        const newCategory = { name: categoryName };
        const categoriesRef = database.ref('categories');
        categoriesRef.push(newCategory);

        // Limpar o formulário e fechar o modal
        $(this)[0].reset();
        $('#addCategoryModal').modal('hide');

        // Recarregar a lista de categorias
        loadCategoryList();
    }
});

// Lógica para carregar a lista de produtos usando Realtime Database
function loadProductList() {
    const productsRef = database.ref('products');

    productsRef.once('value').then(snapshot => {
        const products = [];
        snapshot.forEach(childSnapshot => {
            const product = childSnapshot.val();
            product.key = childSnapshot.key;
            products.push(product);
        });

        displayProductList(products);
    });
}

// Lógica para exibir a lista de produtos na página
function displayProductList(products) {
    const productListContainer = $('#product-list');
    productListContainer.empty();

    products.forEach(product => {
        const cardHTML = `
            <div class="card">
                <img src="${product.image || 'https://via.placeholder.com/150'}" class="card-img-top" alt="Imagem do Produto">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text"><strong>Categoria:</strong> ${product.category}</p>
                    <p class="card-text"><strong>Preço:</strong> $${product.price.toFixed(2)}</p>
                    <button class="btn btn-warning" onclick="editProduct('${product.key}')">Editar</button>
                    <button class="btn btn-danger" onclick="deleteProduct('${product.key}')">Excluir</button>
                </div>
            </div>
        `;
        productListContainer.append(cardHTML);
    });
}

// Função para editar um produto
function editProduct(key) {
    const productRef = database.ref(`products/${key}`);

    productRef.once('value').then(snapshot => {
        const product = snapshot.val();

        // Preencher o formulário de edição com os dados existentes
        $('#productName').val(product.name);
        $('#productCategory').val(product.category);
        $('#productDescription').val(product.description);
        $('#productPrice').val(product.price);
        $('#productImage').val(product.image);

        // Adicionar a chave do produto ao botão de salvar para indicar que é uma edição
        $('#addProductForm button[type="submit"]').data('key', key);

        // Abrir o modal de adição de produto para edição
        $('#addProductModal').modal('show');
    });
}

// Função para excluir um produto
function deleteProduct(key) {
    const confirmation = confirm('Tem certeza que deseja excluir este produto?');

    if (confirmation) {
        const productRef = database.ref(`products/${key}`);
        productRef.remove();

        // Recarregar a lista de produtos após a exclusão
        loadProductList();
    }
}

// Lógica para adicionar ou atualizar um produto no Realtime Database
function addOrUpdateProduct(product) {
    const productsRef = database.ref('products');

    // Se o produto já existe (edição), use a chave do produto
    if (product.key) {
        const productRef = productsRef.child(product.key);
        productRef.set(product);
    } else {
        // Se o produto é novo (adição), crie uma nova chave
        productsRef.push(product);
    }
}

// Lógica para adicionar um novo produto
$('#addProductForm').submit(function (e) {
    e.preventDefault();

    const productName = $('#productName').val();
    const productCategory = $('#productCategory').val();
    const productDescription = $('#productDescription').val();
    const productPrice = parseFloat($('#productPrice').val());
    const productImage = $('#productImage').val();

    if (productName.trim() !== "" && productCategory.trim() !== "") {
        const newProduct = {
            name: productName,
            category: productCategory,
            description: productDescription,
            price: productPrice,
            image: productImage
        };

        // Se houver uma chave do produto (edição), use-a
        const productKey = $(this).find('button[type="submit"]').data('key');
        if (productKey) {
            newProduct.key = productKey;
        }

        addOrUpdateProduct(newProduct);

        // Limpar o formulário e fechar o modal
        $(this)[0].reset();
        $('#addProductModal').modal('hide');
    }
});

// Inicializar a aplicação carregando as listas de categorias e produtos
loadCategoryList();
loadProductList();
