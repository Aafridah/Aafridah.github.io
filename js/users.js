$(document).ready(function (){
    initGrid();
    });

    function initGrid(){
        columnDefs = [
            { 
                field: "UserId",
                headerName: '#'
            },
            { 
              field: "FirstName",
              headerName: 'First Name' 
            },
            { 
              field: "LastName",
              headerName: 'Last Name'  
            },
            { 
              field: "EmailAddress",
              headerName: 'Email'  
            },
            { 
              field: "Action",
              headerName: 'Action',
              cellRenderer : params => {
                const eDiv = document.createElement('div');
                eDiv.innerHTML = '<a href="#"> <i title="Delete" class="fa-solid fa-trash-can text-danger p-1"> </i></a> \
                <a href="#" data-bs-toggle="modal" data-bs-target="#editUserModal"> <i title="Edit" class="fa-solid fa-user-gear text-primary"></i></a>';
                
                return eDiv;
            }  
            }
          ];
          
          // specify the data
          rowData = [
            { UserId: 1, FirstName: "Toyota", LastName: "Celica", EmailAddress:  "Toyota@gmail.com"},
            { UserId: 2, FirstName: "Toyota", LastName: "Celica", EmailAddress: 35000 },
            { UserId: 3, FirstName: "Toyota", LastName: "Celica", EmailAddress: 35000 },
            { UserId: 4, FirstName: "Toyota", LastName: "Celica", EmailAddress: 35000 },
            { UserId: 5, FirstName: "Toyota", LastName: "Celica", EmailAddress: 35000 },
            { UserId: 6, FirstName: "Ford",   LastName: "Mondeo", EmailAddress: 32000 },
            { UserId: 7, FirstName: "Porsche", LastName: "Boxster", EmailAddress: 72000 }
          ];
          
          // let the grid know which columns and what data to use
          gridOptions = {
            columnDefs: columnDefs,
            rowData: rowData,
            onModelUpdated: () => autoSizeAll(gridOptions),
          };

          const gridDiv = document.querySelector('#usersGrid');
            new agGrid.Grid(gridDiv, gridOptions);
         
    }

    function autoSizeAll(gridOptions, skipHeader = false) {
      const allColumnIds = [];
      gridOptions.columnApi.getColumns().forEach((column) => {
        allColumnIds.push(column.getId());
      });
    
      gridOptions.columnApi.autoSizeColumns(allColumnIds, skipHeader);
    }

 