$(function(){

$(document).ready(function() {
   // generate markup
   $("#rating").append("Please rate: ");
   
   for ( var i = 1; i <= 5; i++ ) {
     $("#rating").append("<a href='#'>" + i + "</a> ");
   }
   
   // add markup to container and apply click handlers to anchors
   $("#rating a").click(function(e) {
     // stop normal link click
     e.preventDefault();
     
     // send request
     $.post("rate.php", {rating: $(this).html()}, function(xml) {
       // format and output result
       $("#rating").html(
         "Thanks for rating, current average: " +
         $("average", xml).text() +
         ", number of votes: " +
         $("count", xml).text()
       );
     });
   });
 });

	$("a").click(function(){
		alert("Hello World!")
	})
	
	$("#orderedlist li:last").hover(function(){
		$(this).addClass("green")
	},function(){
		$(this).removeClass("blue")
	})
	
	$("#orderedlist").find("li").each(function(i){
		$(this).append("BAM!" + i)
	})
	
	$("#reset").click(function(){
		$("form").each(function(){
			this.reset();
		})
	})
	
	$("li").not(":has(ul)").css("border", "1px solid black")
	$("a[name]").css("background","#eee");
	
	$("a[href*='/content/gallery']").click(function(){
		//stuff
	})
	
	$('#faq').find('dd').hide().end().find('dt').click(function(){
		$(this).next().slideToggle();
	})
	
	$("a").hover(function(){
		$(this).parents("p").addClass("highlight")
	},function(){
		$(this).parents("p").removeClass("highlight")
	})
	
	$("a").toggle(function(){
     $(".stuff").animate({ height: 'hide', opacity: 'hide' }, 'slow');
   },function(){
     $(".stuff").animate({ height: 'show', opacity: 'show' }, 'slow');
   });
})

function addClickHandlers(){
	$("a.remote", this).click(function(){
		$("#target").load(this.href, addClickHandlers);
	})
}