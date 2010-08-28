 //IE fix Array.indeOf
 if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return i;
            }
        }
        return -1;
    };
}


// Main Variables
var xFields = 40, //width
    yFields = 20, //height
    fieldSize = 20,
    container = document.getElementById('container'),
    //construction Vars
    table = document.createElement('table'),
    tbody = document.createElement('tbody');

container.appendChild(table); 
table.appendChild(tbody);

for( var y = 0; y < yFields; y++ ) { //'draw' rows
    var row = document.createElement('tr');
    tbody.appendChild(row);
    for( var x = 0; x < xFields; x++ ) { //and cols
        var field = document.createElement('td');
        field.width = fieldSize;
        field.height = fieldSize;
        field.id = x+"_"+y;
        row.appendChild(field);
    }
}

///////////////////////////
// creating socket stuff based on socket.io & socket.io-node
io.setPath('/socketIO/');

var socket = new io.Socket(null, {port: 80});
      socket.connect();
      socket.on('message', function(obj){
        console.log(obj);
        if ('buffer' in obj) {
          document.getElementById('debug').innerHTML += '<br/>connection server responces:';
          for (var i in obj.buffer) document.getElementById('debug').innerHTML += '<br/>'+obj.buffer[i].message[1];
          
          //there are msgs in buffer so if you connect it has to be propagated
          //for (var i in obj.buffer) message(obj.buffer[i]);  
          
        } else {
            document.getElementById('debug').innerHTML += '<br/>'+obj.message[1];
        }
      });      


//keys
document.onkeypress = function (e){
        var evtobj=window.event? event : e,
            unicode=evtobj.charCode? evtobj.charCode : evtobj.keyCode;
    socket.send(unicode);
}
        