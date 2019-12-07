var TTCart = {
	load : function(){ // 加载购物车数据
		
	},
	itemNumChange : function(){
		$(".increment").click(function(){//＋
			var _thisInput = $(this).siblings("input");//取兄弟节点<input>
			_thisInput.val(eval(_thisInput.val()) + 1);
			$.post("/cart/update/num/"+_thisInput.attr("itemId")+"/"+_thisInput.val() + ".action",function(data){
				TTCart.refreshTotalPrice();
			});
		});
		$(".decrement").click(function(){//-
			var _thisInput = $(this).siblings("input");
			if(eval(_thisInput.val()) == 1){
				return ;
			}
			_thisInput.val(eval(_thisInput.val()) - 1);
			$.post("/cart/update/num/"+_thisInput.attr("itemId")+"/"+_thisInput.val() + ".action",function(data){
				TTCart.refreshTotalPrice();
			});
		});
		$("#toggle-checkboxes_up").click(function() {
			$("input[type='checkbox']:gt(0)").prop("checked", this.checked);
			var list = $(".item");
			if(this.checked){
				//全选
				for(var i = 0;i<list.length;i++){
					list[i].setAttribute("class","item item_selected");
				}
			}else{
				for(var i = 0;i<list.length;i++){
					list[i].setAttribute("class","item");
				}
			}
			TTCart.refreshTotalPrice();
		});
		$("#toggle-checkboxes_down").click(function() {
			$("#toggle-checkboxes_up").prop("checked",this.checked);
			var list = $(".item");
			for(var i = 0;i<list.length;i++){
				list[i].getElementsByClassName("checkbox")[0].checked = this.checked;
			}
			if(this.checked){
				//全选
				for(var i = 0;i<list.length;i++){
					list[i].setAttribute("class","item item_selected");
				}
			}else{
				for(var i = 0;i<list.length;i++){
					list[i].setAttribute("class","item");
				}
			}
			TTCart.refreshTotalPrice();
		});
		$(".checkbox").click(function(){
			var flag = true;
			var list = $(".item");
			for(var i = 0;i<list.length;i++){
				var status = list[i].getElementsByClassName("checkbox")[0].checked;
				if(!status){
					//未选中
					$("#toggle-checkboxes_up").prop("checked",false);
					$("#toggle-checkboxes_down").prop("checked",false);
					flag = false;
					break;
				}
			}
			//商品选中时，背景颜色改变
			for(var i = 0;i<list.length;i++){
				var status = list[i].getElementsByClassName("checkbox")[0].checked;
				if(status){
					list[i].setAttribute("class","item item_selected");
				}else{
					list[i].setAttribute("class","item");
				}
			}
			//所有商品都选中，则全选
			if(flag){
				$("#toggle-checkboxes_up").prop("checked",true);
				$("#toggle-checkboxes_down").prop("checked",true);
			}
			TTCart.refreshTotalPrice();
		});
		$(".quantity-form .quantity-text").rnumber(1);//限制只能输入数字
		$(".quantity-form .quantity-text").change(function(){
			var _thisInput = $(this);
			$.post("/service/cart/update/num/"+_thisInput.attr("itemId")+"/"+_thisInput.val(),function(data){
				TTCart.refreshTotalPrice();
			});
		});
	},
	refreshTotalPrice : function(){ //重新计算总价
		var total = 0;
		//获取所有商品
		var list = $(".item");
		//遍历
		for(var i = 0;i<list.length;i++){
			//商品是否选中
			var status = list[i].getElementsByClassName("checkbox")[0].checked;
			//先拿到商品数量的元素
			var itemInfo = list[i].getElementsByClassName("quantity-text")[0];
			//得到商品价格
			var price = itemInfo.getAttribute("itemPrice");
			//得到商品的数量
			var num = itemInfo.value;
			if(status){
				//如果是选中的，就加入总价
				total += (eval(price) * 10000 * eval(num)) / 10000;
			}
		}
		$(".totalSkuPrice").html(new Number(total/100).toFixed(2)).priceFormat({ //价格格式化插件
			 prefix: '￥',
			 thousandsSeparator: ',',
			 centsLimit: 2
		});
	}
};

$(function(){
	TTCart.load();
	TTCart.itemNumChange();
});