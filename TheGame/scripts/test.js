// Test parsing data between front end and backend
function testBackend()
{
    $.ajax({
        type: "POST",
        url:  "http://10.194.131.157:5000/test",
        dataType: 'json',
        data: JSON.stringify({'value': 0}),

        success: function(response) {
            alert("Value: " + response['result']);
        },

        error: function(error)
        {
            console.log(error);
        }
    });
}