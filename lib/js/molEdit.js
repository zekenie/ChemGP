$(".molWrapper").popover({
					trigger: 'manual',
					html:true,
					placement:'bottom',
					content:function(){
						var thisMol = $(this),
							returnStr = "";
						var roles = ["reactant","product","solvant"];
						returnStr += "<select id='role'>";
						for(role in roles){
							returnStr += "<option value='" + roles[role] + "' ";
							if(roles[role] == thisMol.attr("data-role"))
								returnStr += "selected='selected' ";
							returnStr += ">" + roles[role] + "</option>";
						}
						returnStr += "</select><textarea id='notes' placeholder='Notes...'>" + thisMol.attr('data-notes') + "</textarea><div><input type='text' id='concentration' placeholder='Concentration (molarity)' value='" + thisMol.attr("data-concentration") + "'/></div><div><input type='text' name=specificRole' id='specificRole' placeholder='Role' value='" + thisMol.attr("data-specificRole") + "'/></div><div class='form-actions' style='margin:0;'><button class='btn-large btn' id='moleculeDetails'>Molecule Details...</button><button class='btn-large btn btn-danger' id='moleculeDelete'>Remove From Reaction</button><button class='btn btn-large btn-success' id='moleculeSave'>Save Changes</button></div>";
						
						return returnStr;

					}
				})
				.click(function(e){
					e.preventDefault();
					$('.molWrapper').not(this).popover('hide');
					var thisMol = $(this);
					thisMol.popover('toggle');
					
					var changed = {moleculeReactionLinkID:thisMol.attr("data-moleculeReactionLinkID")},
						changeRole = null;
					
					$(".popover").find("input,select,textarea").change(function(e){
						changed["link[" + $(this).attr("id") + "]"] = $(this).val();
						if($(this).attr("id") == "role")
							changeRole = $(this).val();
					});
					
					$("#moleculeDetails").click(function(){
						window.location = "../molecule/view.php?moleculeID=" + thisMol.attr("data-moleculeID");
					});
					
					$("#moleculeDelete").click(function(){
						if(confirm("Are you sure you want to remove this molecule from the reaction!?")){
							$.get("../moleculeReactionLink/delete.php","moleculeID=" + thisMol.attr("data-moleculeID") + "&reactionID=" + thisMol.attr("data-reactionID"),
							 function(){
							 	thisMol.popover("toggle");
								thisMol.parent("li.span4").hide(250);
							});
						}
					});
					$("#moleculeSave").click(function(){
						console.log("save was clicked.");
						$.ajax({
							url:"../moleculeReactionLink/update.php",
							data: changed,
							dataType:"JSON"
						}).done(function(response){
							$.each(response,function(key,value){
								thisMol.attr("data-" + key,value);
							});
							if(changeRole != null)
								$("#" + changeRole + "> ul").append(thisMol.parent("li.span4"));
							thisMol.popover('toggle');
						}).fail(function(el){
							console.log("error");
							console.log(el);
						});
					});
				});