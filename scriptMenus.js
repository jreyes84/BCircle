db.menus.insert({"icon" : "gi gi-stopwatch sidebar-nav-icon", "children" : [ ],"status" : true, "order" : 1, "url" : "/", "description" : "Dashboard", "name" : "Dashboard"})

db.menus.insert({"icon" : "fa fa-bookmark sidebar-nav-icon", "children" : [ ],"status" : true,"order" : 3,"url" : "menus/menulist", "description" : "Administracion de menus","name" : "Menus"})

db.menus.insert({"icon" : "hi hi-user sidebar-nav-icon", "children" : [ ],"status" : true,"order" : 2,"url" : "users/userslist","description" : "Administracion de usuarios","name" : "Usuarios"})

db.menus.insert({"icon" : "hi hi-list-alt sidebar-nav-icon", "children" : [{ "status" : true,"order" : 1,"url" : "factura/odc","description" : "Ordenes de Crédito","name" : "ODC" },{"status" : true,"order" : 2,"url" : "factura/edf","description" : "Emisiones de facturas","name" : "Emisión Factura"}],	"status" : true,"order" : 4,"url" : "",	"description" : "Administración de facturas","name" : "Factura"})

db.menus.insert({"icon" : "gi gi-parents sidebar-nav-icon", "children" : [ ], "status" : true, "order" : 5, "url" : "contactos", "description" : "Administración de Contactos", "name" : "Contactos"}

db.menus.insert({"icon" : "fa fa-calendar sidebar-nav-icon", "children" : [ ], "status" : true, "order" : 5, "url" : "calendars","description" : "Eventos en el calendario", "name" : "Calendario"})

db.menus.insert({"icon" : "fa fa-list sidebar-nav-icon", "children" : [{"status" : true,"order" : 1,"url" : "cuentas", "description" : "Administra las cuentas del sistema", "name" : "Administrar cuentas" }, {"status" : true,	"order" : 2,"url" : "template-movimientos",	"description" : "Crea templates con tus cuentas","name" : "Template movimientos"}],"status" : true,"order" : 2,"url" : "","description" : "Administración de Cuentas","name" : "Cuentas"})

db.menus.insert({"icon" : "fa fa-book sidebar-nav-icon", "children" : [ ], "status" : true, "order" : 2, "url" : "documentos", "description":"Administra los documentos", "name" : "Documentos"})

db.menus.insert({"icon" : "fa fa-bar-chart-o sidebar-nav-icon",	"children" : [{"status" : true,"order" : 1,"url" : "rpts", "description" : "Reportes", "name" : "Reporte 1" }],"status" : true,"order" : 2,"url" : "","description" : "Administra Reportes","name" : "Reportes"})