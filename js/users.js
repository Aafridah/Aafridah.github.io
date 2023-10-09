$(document).ready(function (){
    initGrid();
    });

    function initGrid(){
        columnDefs = [
            { 
                field: "serial_number",
                headerName: '#'
            },
            { field: "make" },
            { field: "model" },
            { field: "price" }
          ];
          
          // specify the data
          rowData = [
            { serial_number: 1, make: "Toyota", model: "Celica", price: 35000 },
            { serial_number: 2, make: "Toyota", model: "Celica", price: 35000 },
            { serial_number: 3, make: "Toyota", model: "Celica", price: 35000 },
            { serial_number: 4, make: "Toyota", model: "Celica", price: 35000 },
            { serial_number: 5, make: "Toyota", model: "Celica", price: 35000 },
            { serial_number: 6, make: "Ford", model: "Mondeo", price: 32000 },
            { serial_number: 7, make: "Porsche", model: "Boxster", price: 72000 }
          ];
          
          // let the grid know which columns and what data to use
          gridOptions = {
            columnDefs: columnDefs,
            rowData: rowData,
           
          };

         
          // setup the grid after the page has finished loading
          const gridDiv = document.querySelector('#usersGrid');
            new agGrid.Grid(gridDiv, gridOptions);
         
    }

 