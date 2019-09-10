const mysql = require('mysql');
const routes = require('routes')();
const url = require('url');
const view = require('swig');
const http = require('http');
var qString = require('querystring');

const port = 4000;


var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "learn_node"
})

routes.addRoute('/', function (req, res) {

    connection.query("select * from santri", function (err, rows, fields) {
        if (err) throw err;
        var html = view.compileFile('./views/index.html')
        ({
            title: "Data Santri Magelang",
            data : rows
           
        })
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(html)
     })

    // var html = view.compileFile('./views/index.html')();
    //         res.writeHead(200, { 'Content-Type': 'text/html' })
    //         res.end(html)
})
    


routes.addRoute('/insert', function (req, res) {
    // connection.query('insert into santri set ?', {
    //     name_santri: "",
    //     residence: "",
                               
    //     number_phone : ""
    // }, function (err, field) {
    //         if (err) throw err;
    //         console.log(field.affectedRows);

    // res.writeHead(200, { "Content-Type": "text/plain" })
    // res.end(field.affectedRows+" affectedrows Succesed")
    // })

    if (req.method.toUpperCase() == "POST") {
        var data_post = "";
        req.on('data', function (chuncks) {
            data_post += chuncks;
           
        })
        req.on('end', function () {
            data_post = qString.parse(data_post);
                    connection.query('insert into santri set ?',data_post, function (err, field) {
                    if (err) throw err;

            res.writeHead(302, { "Location": "/" })
            res.end()
    })
});

    } else {
        var html = view.compileFile('./views/form.html')();
        res.writeHead(200, { 'content-type': 'text/html' })
        res.end(html)
    }
})


routes.addRoute('/update/:id', function (req, res) {
    // connection.query('update santri set ? where ?', [
    //     { name_santri: "ciko diko" },
    //     { residence: "jogjakarta indonesia" }

    // ], function (err, fields) {
    //     if (err) throw err;

    //     res.writeHead(200, { 'Content-Type': 'text/plain' })
    //     res.end(fields.changedRows + " rows update")
    // })

    connection.query("select * from santri where ?",
        { id_santri: this.params.id },
        function (err, rows, field) {
            if (rows.length) {

                var data = rows[0];

                if (req.method.toUpperCase() == "POST") {
                    
                    var data_post = "";
                    req.on('data', function (chuncks) {
                        data_post += chuncks;
                    });
                    req.on('end', function () {
                        data_post = qString.parse(data_post);
                           connection.query('update santri set ? where ?', [
                                       data_post,
                                       { id_santri: data.id_santri }
                           ],function (err, fields) {
                               if (err) throw err;
                               res.writeHead(302, { 'Location': '/' })
                               res.end()
                           })
                        })
    
                } else {
                    var html = view.compileFile('./views/form_update.html')({
                        data: data
                    });
                    res.writeHead(200, { "Content-type": "text/html" });
                    res.end(html)  
                }        
                } else {
                var htmli = view.compileFile("./views/404.html")();
                res.writeHead(404, { "Content-Type": "text/html" })
                res.end(htmli)
            } 
        }
    );
}) 
   
routes.addRoute('/delete/:id', function (req, res) {
    connection.query('delete from santri where ? ', {

        id_santri: this.params.id
            
    }, function (err, fields) {
        if (err) throw err;

        res.writeHead(302, { 'Location': '/' })
        res.end()
    }
  )
})
http.createServer(function (req, res) {

        var path     = url.parse(req.url).pathname;
        var match    = routes.match(path);
                if (match) {
                    match.fn(req, res);
        } else {
                var html = view.compileFile('./views/404.html')
                res.writeHead(200, { "Content-Type": "text/html" })
                res.end(html);
        }
        }).listen(port)


        console.log("connected at port : " , port)