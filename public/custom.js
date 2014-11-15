$(document).ready(function() {
	$("#edit_ajax").click(function(){
		console.log(1);
		var firstname = $("#firstname").val();
		var lastname = $("#lastname").val();
		var dob = $("#dob").val();
		var dod = $("#dod").val();
		var id = $("#uid").val();
		var data = {
			uid: id,
			firstname: firstname,
			lastname: lastname,
			dob: dob,
			dod: dod
		};

		$.ajax({
				method : 'put',
				url : '/api/objects/' + id,
				data: data,
				success: function(response) {
					var update = 'Response from server\n' + JSON.stringify(response);
					document.getElementById("response").innerHTML = update;
				}
			});		
	});
	$(".del").click(function() {
		var id = ($(this).attr('id'));
		$.ajax({
			method : 'delete',
			url : '/api/objects/' + id,
			success: function(response) {
				location.reload();
			}
		});
	});
})