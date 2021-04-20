// Constants
const products = [ 
    {"id":"1", "name":"Handmade Rubber Shirt", "price":"486", "items":"156", "category":"Clothing"},
    {"id":"2", "name":"Rustic Wooden Shoes", "price":"872", "items":"145", "category":"Shoes"},
    {"id":"3", "name":"Incredible Concrete Chair", "price":"826", "items":"164", "category":"Furniture"},
    {"id":"4", "name":"Sleek Rubber Towels", "price":"1166", "items":"45", "category":"Bath"},
    {"id":"5", "name":"Practical Plastic Chips", "price":"59", "items":"61", "category":"Food"},
    {"id":"6", "name":"Ergonomic Fresh Shoes", "price":"575", "items":"125", "category":"Shoes"},
    {"id":"7", "name":"Gorgeous Granite Pizza", "price":"456", "items":"251", "category":"Food"},
    {"id":"8", "name":"Ergonomic Granite Sausages", "price":"490", "items":"162", "category":"Food"},
    {"id":"9", "name":"Sleek Fresh Ball", "price":"137", "items":"251", "category":"Balls"},
    {"id":"10", "name":"Licensed Steel Shoes", "price":"572", "items":"72", "category":"Shoes"},
    {"id":"11", "name":"Gorgeous Frozen Mouse", "price":"574", "items":"27", "category":"Mouse"},
    {"id":"12", "name":"Unbranded Fresh Salad", "price":"557", "items":"85", "category":"Food"}
];

const KEY_UP = 38,
      KEY_DOWN = 40;

// Variables
let min = 0,
    max = 30, // default value
    step = 1;

$('.ui.icon.button').click(function() {
    let command = $(this).attr('command');
    HandleUpDown(command);
});
$('#txtCount').keypress(function(e) {
    let code = e.keyCode;
    if (code != KEY_UP && code != KEY_DOWN) return;
    let command = code == KEY_UP ? 'Up' : code == KEY_DOWN ? 'Down' : '';
    HandleUpDown(command);
});
function HandleUpDown(command) {
    max = prod_items;
    let val = $('#txtCount').val().trim();
    let num = val !== '' ? parseInt(val) : 0;
    let items = $("#prod_items").text().trim();
    items = parseInt(items.split(' ')[0]);

    val = $('#txtCount').val();
    switch (command) {
        case 'Up':
            if ((items) > 0) {
                if (num < max) {
                    num += step;
                    items -= step;
                } 
            }
            break;
            
        case 'Down':
            if (val > 0) {
                if (num > min) {
                    num -= step;
                    items += step;
                } 
            }
            break;
    }
    $('#prod_items').text(items + (items > 1 ? ' items' : ' item'));
    $('#txtCount').val(num);

    do_calculate();
}
function do_calculate(){
    // calc and display total price and subtotal
    let num = $('#txtCount').val();
    let total_price = num * prod_price
    $('#ntotal').text('$' + comma_format(total_price));
    $('#subtotal').text('$' + comma_format(total_price));

    // display discount
    let disc = Math.ceil(total_price * 0.047);
    $('#discount').text( (disc > 0 ? '-': '') + '$' + comma_format(disc));

    // display vat
    let vat = total_price * 0.1;
    $('#vat').text('$' + comma_format(vat));

    // display net total
    let net_total = total_price - disc + vat;
    $('#net-total').text('$' + comma_format(net_total));
}


function load_categories(){
    const categories = ['Select a Category','Balls','Bath','Clothing','Food','Furniture','Mouse','Shoes','[ ALL ]'];
    
    $('#category').empty();
    categories.forEach( (cat,i) => {
        $('#category').append(
            '<option value="' + ( i === 0 ? ' ': cat) + '">' + cat + '</option>'
        );
    });
}


// clicking a product from the list
$(function() {
    $(document).on('click', '.card', function(e) {
        e.preventDefault();
  
        let prod_info = $(this).text().split('$');
        prod_price = prod_info[1];
        prod_name = prod_info[0];
        $('#prod_name').text(prod_name);
        prod_info = $('#' + prod_name.split(' ').join('-')).val().split(';');
        prod_id = parseInt(prod_info[0]);
        prod_items = prod_id === 1 ? parseInt(prod_info[1]) + 3: parseInt(prod_info[1]);
        $('#prod_items').text(prod_items + ( prod_items > 1 ? ' items': ' item'));
        
        // get image src from img tag 
        prod_image = $(this).children('.image').children('img').attr('src');
        // set 3 attributes (src, alt, title) to the specified img tag
        $("#prod_image").attr( { src:prod_image, alt:prod_name, title:prod_name } );

        $('#txtCount').val(0);
        do_calculate();

    });
});


// searching product through name
$("body").on("keydown", "input.search", function(e) {
    let str = $(this).val(); 
    if(e.keyCode == 13) {
        e.preventDefault();
        load_categories(); // reload categories
        load_found_products(str.toLowerCase());
    }
});
// load found product/s
function load_found_products(str){
    let products_found = [];
    let nfound = 0;

    // search for product
    products.forEach( (product) => {
        let pname = product.name;
        if (pname.toLowerCase().includes(str) === true) {
            products_found.push(product);
            nfound += 1;
            return false; // stops the loop
        }
    });

    if (nfound === 0) {
        $('#product-cards').empty();
        $('#product-cards').append(
            '<div class="ui container" style="padding-left: 0.7543vw">' +
                '<h2 class="ui medium header">No records found.</2>' +
            '</div>'
        );
        return true;
    }

    // clear cards and display found products
    $('#product-cards').empty();
    products_found.forEach( (product) => {
        let image_path = './images/product' + (product.id < 10 ? '0' + product.id : product.id) + '.png';
        let pname = product.name;
        let prod_info = new Array(product.id, product.items, product.category);
        $('#product-cards').append(
            '<div class="card">' +
                '<div class="image">' +
                    '<img src="' + image_path + '" alt="' + pname + '" title="' + pname + '">' +
                '</div>' +
                '<div class="content">' +
                    '<input type="hidden" id="' + pname.split(' ').join('-') + '" name="" value="' + prod_info.join(';') + '" />' +
                    '<div id="' + product.id + '" class="header product-name">' + pname + '</div>' +
                    '<div class="meta">' +
                        '<p id="price-' + product.id + '">$' + product.price + '</p>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    });
}


$('#category').on('change', function () {
    let category = $("#category option:selected").val();
    if (category === '[ ALL ]') {
        load_products();
    } else {
        load_products_by_cat(category);
    }
});
// load products by category
function load_products_by_cat(cat){
    let products_by_cat = products.filter( product => product.category === cat);

    $('#product-cards').empty();
    products_by_cat.forEach( (product) => {
        let image_path = './images/product' + (product.id < 10 ? '0' + product.id : product.id) + '.png';
        let pname = product.name;
        let prod_info = new Array(product.id, product.items, product.category);
        $('#product-cards').append(
            '<div class="card">' +
                '<div class="image">' +
                    '<img src="' + image_path + '" alt="' + pname + '" title="' + pname + '">' +
                '</div>' +
                '<div class="content">' +
                    '<input type="hidden" id="' + pname.split(' ').join('-') + '" name="" value="' + prod_info.join(';') + '" />' +
                    '<div id="' + product.id + '" class="header product-name">' + pname + '</div>' +
                    '<div class="meta">' +
                        '<p id="price-' + product.id + '">$' + product.price + '</p>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    });
}


// load all products
function load_products(){
    $('#product-cards').empty();
    products.forEach( (product) => {
        let image_path = './images/product' + (product.id < 10 ? '0' + product.id : product.id) + '.png';
        let pname = product.name;
        let prod_info = new Array(product.id, product.items, product.category);
        $('#product-cards').append(
            '<div class="card">' +
                '<div class="image">' +
                    '<img src="' + image_path + '" alt="' + pname + '" title="' + pname + '">' +
                '</div>' +
                '<div class="content">' +
                    '<input type="hidden" id="' + pname.split(' ').join('-') + '" name="" value="' + prod_info.join(';') + '" />' +
                    '<div id="' + product.id + '" class="header product-name">' + pname + '</div>' +
                    '<div class="meta">' +
                        '<p id="price-' + product.id + '">$' + product.price + '</p>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    });
}

function comma_format(val){
    let dec = Math.ceil((val % 1) * 100) * 0.1;
    let sval = parseInt(val);
    while (/(\d+)(\d{3})/.test(sval.toString())){
      sval = sval.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return '' + sval + '.' + parseInt(dec);
}