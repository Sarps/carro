
var app = {
    
    initialize: function () {
        this.bindEvents();
    },
    
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function () {
        setTimeout(() => {
            document.querySelector('#cover').style.display = "none"
            QRScanner.prepare(app.onCameraCallback);
        }, 5000)
    },

    onCameraCallback(err, status) {
        if (err) {
            console.error(err);
            return
        }
        if (status.authorized) {
            //QRScanner.show()
            QRScanner.scan(app.onScanCallback);
        } else if (status.denied) {
            alert('You need to allow access to your camera in settings')
            QRScanner.openSettings()
        } else {
            alert('You need to allow access to your camera')
            QRScanner.prepare(app.onCameraCallback);
        }
    },

    onScanCallback (err, contents) {
        if (err) {
            console.error(err._message);
        }
        vm.addItem(contents.result)
    }
};

let vm = new Vue({
    el: ".app",

    data: {
        products: [],
        can_add_item: true
    },

    computed: {

        taxExclusive(){
            return this.products.reduce((t, c) => t + (c.price * c.quantity), 0)
        },

        taxInclusive() {
            return this.products.reduce((t, c) => {
                let cost = c.price * c.quantity
                return t + cost + cost * c.rate 
            }, 0)
        }
    },

    methods: {
        addItem(item) {
            item = (typeof item === "string") ? JSON.parse(item) : item
            console.log(item)
            let index = this.productIndex(item.name)
            if (index > -1) {
                let resp = confirm(`Are you sure you want to increase quantity of ${item.name} to ${this.products[index].quantity+1}`)
                if (resp) this.products[index].quantity++
                //alert(`Increasing quantity of ${item.name} to ${this.products[index].quantity}`);
            } else {
                item.quantity = 1
                let resp = confirm(`Are you sure you want to add ${item.name} to cart`)
                if (resp) this.products.unshift(item)
                //alert(`Adding ${item.name} to cart`);
            }
            setTimeout(() => QRScanner.scan(app.onScanCallback), 3000)
        },

        productIndex(name) {
            return this.products.findIndex(p => p.name === name)
        }
    }
})
