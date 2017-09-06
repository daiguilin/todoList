
var store = {
	save(key,value){
		localStorage.setItem(key,JSON.stringify(value));
	},
	fetch(key){
		return JSON.parse(localStorage.getItem(key)) || [];
	}
}
var filter = {
	all:function(list){
		
		return list;
		
	},
	unfinished:function(list){
		return list.filter(function(item){
			return !item.isChecked
		})
	},
	finished:function(list){
		return list.filter(function(item){
			return item.isChecked
		})
	}
}

var list=store.fetch("listData")/*[
			{
				title:"写作业",
				isChecked:false
			},
			{
				title:"打篮球",
				isChecked:true
			}
		]*/
var vm= new Vue({
	el:".main",
	data:{
		visibility:"all",
		filterList:'',
		edtorTodos:'',
		berforeEdtor:'',
		data:'',
		list:list
	},
	computed:{
		noCheckLength:function(){
			return this.list.filter(function(item){
				return !item.isChecked
			}).length
		},
		filteredList:function(){
			return filter[this.visibility] ? filter[this.visibility](list): list;
		}
	},
	watch:{//watch 用于监听list属性，当属性变化时执行函数
		/*list:function(){	//此监听不能深度监听list对象内的属性改变
			store.save("listData",this.list)
		}*/
		list:{
			handler:function(){
				store.save("listData",this.list)
			},
			deep:true
		}
	},
	methods:{
		addTodo(){
			this.list.push({
				title:this.data,
				isChecked:false
			})
			this.data="";
		},
		deleteTodo(todo){
			var index=this.list.indexOf(todo);
			this.list.splice(index,1)
		},
		edtorTodo(todo){
			this.edtorTodos=todo;//此方法很巧妙的利用要改变的数据对象是否与当前选中的传回来的数据对象是否一致，来控制编辑框的显示隐藏
			this.berforeEdtor=todo.title;
		},
		edtorTodoed(todo){
			this.edtorTodos='';
		},
		cancelEdtor(todo){
			// console.log(0)
			todo.title=this.berforeEdtor;
			this.edtorTodos='';//当用户按下esc时，应该取消编辑，不然处于输入编辑状态，对title赋值，输入框内容不会有变化
			this.berforeEdtor='';
		}
	},
	directives:{//自定义指令
		"foucs":{
			update(el,binding){
				if(binding.value){
					el.focus();
				}
			}
		}
	}
})
	function watchChangeHash(){
		var hash=window.location.hash.slice(1);
		//console.log(typeof hash)
		vm.visibility=hash;
	}
	watchChangeHash();

	window.addEventListener("hashchange",watchChangeHash)