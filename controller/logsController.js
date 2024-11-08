$(document).ready(function () {
    $("[data-page='view/logs/logs.html']").addClass("active");
})
async function loadTable(){
    $('#log-table-body').empty();
    const option={
        method:"GET",
    }
    try{
        const response=await fetch("http://localhost:8082/api/v1/logs",option);
        const data=await response.json();
        data.forEach((log)=>{
            $('#log-table-body').append(`
                <tr>
                    <td id="log-id">${log.logCode}</td>
                    <td id="log-description">${log.logDescription}</td>
                    <td id="log-date">${log.date}</td>
                    <td id="log-image">${log.observedImage}</td>
                </tr>
            `)
        })
    }
}