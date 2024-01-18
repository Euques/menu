// ... (código anterior) ...

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

        addOrUpdateProduct(newProduct);

        // Limpar o formulário e fechar o modal
        $(this)[0].reset();
        $('#addProductModal').modal('hide');
    }
});
