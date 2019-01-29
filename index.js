
var dbName = 'ereyomi';
var dbVersion = '1.0';
var dbDisplaName = 'gpa';
var dbSize = 2*1024*1024;
var db = openDatabase(dbName, dbVersion, dbDisplaName, dbSize);

//create table
db.transaction(function (tx){
	tx.executeSql('CREATE TABLE IF NOT EXISTS user(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, number TEXT NOT NULL)',
			[],
			function(tx, results) { console.log('Database creation sucessful' + results);},
			function(tx, error) {console.log('Database creation unsucessful' + error);}
		);
});

 //insert into database
document.querySelector('.clickMe').addEventListener('click', () => {
	
        var myText = document.querySelector('#text').value;
        var myNum = document.querySelector('#number').value;
        
            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO user (name, number) VALUES (?, ?)',
                    [myText, myNum],
                    function(tx, results) {
                        outputMe();
                        console.log(results.insertId);
                    }, function(tx, error) {
                        console.log(error);
                    });
            });
        


});


// read /  display  all in database
var showMe = document.querySelector('.showMe');
        
    
        function outputMe(){
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM user',
                    [],
                    function(tx, results) {
                        var row = results.rows;
                        var len = results.rows.length;
                        showMe.innerHTML = "";
                        for (var i = 0; i < len; i++) {
                         var item = row.item(i); 
                        let box = document.createElement('div');
                            box.innerHTML = `the id is: ${item.id}  the name is :   ${item.name}    tne number is:   ${item.number} [<a href='javascript:void(0);' onclick='deleteMe(${item.id});'>Delete me</a>]   [<a href='javascript:void(0)' onclick='edit(${item.id});'>Edit</a>]`;
                            showMe.appendChild(box);
                            
                        
                           
                            }     
                    }, function(tx, error) {
                        console.log(error);
                    });
            });
        }


     



document.querySelector('.displayMe').addEventListener('click', () => {
    
        outputMe();


});

// delete an item
    function deleteMe(id) {
      
        db.transaction(function(tx){
            tx.executeSql("DELETE FROM user WHERE id=?",
                [id],
                function(tx, results){outputMe();},
                function(tx, results){console.log('error in delete');}
                );
        });  
        
    }


// delete table 
function deleteTable(){
    db.transaction(function(tx){
        tx.executeSql(
            "DROP TABLE user",
            [],
            function(tx, results) {displayIt();console.log('sucessful droped');},
            function(tx, error) {console.log('cannot be deleted');}
            );
    });
}

/* ----------------------------------
                edit and update
   ---------------------*/
let editBox = document.querySelector('.editBox');
editBox.style.display ='none',
showID = document.querySelector('.showID'),
submit =document.querySelector('#submit');

//update function

   


var getID;
let edit = (id) => {
    editBox.style.display ='block';
    getID = id;
    showID.innerHTML = getID;

    //document..getElementById('myForm').reset()
    submit.addEventListener('click', (event)=>{
        event.preventDefault(); //to prevent submit button action
        console.log(getID);
    var updateText = document.querySelector('#updateText').value,
        updateNum =document.querySelector('#updateNum').value;
        
        db.transaction(function(tx) {
        tx.executeSql(`UPDATE user SET name=?, number=? WHERE id=${getID}`, [updateText, updateNum], 
            function(tx, result) {
                 outputMe();
                console.log('Record Updated Successfully!');
                editBox.style.display ='none';
        }, function(tx, error) {
            console.log(error + 'in updating data');}
        );
    });

    });
}


/* ----------------------------------
                search database
   ---------------------*/
    

var showSearch = document.querySelector('.showSearch'),
searchInputBox = document.querySelector('#searchText');

searchInputBox.addEventListener('input', ()=>{
    event.preventDefault();
    let searchInput = searchInputBox.value;
    showSearch.innerHTML="";
    searchIt(searchInput);
});
        let searchIt =(input)=> {
            db.transaction((tx) => {
                tx.executeSql('SELECT * FROM user WHERE name=?',
                    [input],
                    function(tx, results) {
                        var row = results.rows;
                        var len = results.rows.length;
                        if(len == 0)
                        {
                            console.log("No result");
                            showSearch.innerHTML="no Result";
                            //confirm("no result");
                        }
                        showMe.innerHTML = "";
                        for (var i = 0; i < len; i++) {
                         var item = row.item(i);
                            let box2 = document.createElement('div');
                            showSearch.innerHTML = `the id is: ${item.id}  the name is :   ${item.name}    tne number is:   ${item.number} [<a href='javascript:void(0);' onclick='deleteMe(${item.id});'>Delete me</a>]   [<a href='javascript:void(0)' onclick='edit(${item.id});'>Edit</a>]`;
                            showSearch.appendChild(box2);
                            } 
                    }, function(tx, error) {
                        console.log(error);
                    });
            });
        }