$(function(){
  var winW = $(window).width(),
      winH = $(window).height(),
      startX,
      startY,
      lastStage = $('.slide_stage').length,
      slideBox = $('#slide_box'),
      menubox = $('#menubox'),
      content = $('#contentsbox').find('ul');

  //初始化布局
  slideBox.css('width',lastStage*100+'%');
  $('.slide_stage').css('width',(1/lastStage)*100+'%');

  //初始化UI
  (function iniColor(){
    $('#menu_btn').css('background',uiColor.mainbtn);
    $('#content_btn').css('background',uiColor.mainbtn);
    $('#progress_bar').css('background',uiColor.progress);
    $('#progress_bar').find('.bar').css('border-color',uiColor.progress);
    $('#titlebox').css('background',uiColor.title);
    $('#curpage').css('background',uiColor.curpage);
    $('#maxpage').css('background',uiColor.maxpage);
  }());

  //获取Url参数
  function getUrl(){
    var oriUrl = decodeURIComponent(location.search.substr(1,location.search.length));
    var urlArr = oriUrl.split('&');
    for(i=0; i<urlArr.length; i++){
      var urlKey = urlArr[i].split('=');
      menubox.find('#geren_link').attr('href','http://www.hemax.net/hemax1/api/hy');
      switch(urlKey[0]){
        case 'tel':
          console.log('tel is '+ urlKey[1]);
          $('#contentsbox').find('#kefu_link').attr('href','tel:' + urlKey[1]);
          break;
        case 'curl':
          console.log('curl is '+ urlKey[1]);
          menubox.find('#quanzi_link').attr('href',urlKey[1]);
          break;
        case 'id':
          console.log('id is '+ urlKey[1]);
          id = urlKey[1];
          break;
        case 'buy':
          console.log('buy is '+ urlKey[1]);
          //menubox.find('#shangcheng_link').attr('href',urlKey[1]);
          break;
        case 'd':
          console.log('d is ' + urlKey[1])
          ctx = urlKey[1];
          break;
        case 'j':
          console.log('j is '+ urlKey[1]);
          break;
        default:
          break;
      };
    };
  };
  getUrl();

  //封皮首页滑动
  $('#homepage').on('swipeLeft',function(){
    $(this).removeClass('active');
    $('#stage1').addClass('active');
    pageNum();
  })

  //控制翻页滑动
  slideBox.on('touchstart','.slide_stage',function(event){
    event.preventDefault();
    myIndex = $(this).attr('id').substr(5);
    var touch = event.originalEvent.touches[0];
    startX = touch.pageX + (myIndex-1)*winW;
    startY = touch.pageY;
    slideBox.removeClass('autoslide');
  });

  slideBox.on('touchmove','.slide_stage',function(event){
    event.preventDefault();
    var touch = event.originalEvent.touches[0];
    var x = touch.pageX - startX;
    var y = touch.pageY - startY;

    //判断滑动方向
    var moveDis = touch.pageX - startX + (myIndex-1)*winW;
    if(myIndex==1 && moveDis>0){
      return false;
    }
    if(myIndex == lastStage && moveDis<0){
      return false;
    }
    slideBox.css('-webkit-transform','translate3d('+ x +'px,0,0)');
  });

  slideBox.on('touchend','.slide_stage',function(event){
    event.preventDefault();
    var touch = event.originalEvent.changedTouches[0];
    var x = touch.pageX - startX + (myIndex-1)*winW;
    var y = touch.pageY - startY;

    slideBox.addClass('autoslide');
    pageNum();
    //向左滑动,下一页
    if(myIndex!=lastStage && x<=-50){
      slideBox.css('-webkit-transform','translate3d('+ -myIndex * winW +'px,0,0)');
      $('.slide_stage').removeClass('active');
      $(this).next('.slide_stage').addClass('active');
    }
    //保持原页
    if(x>=-50 && x <50){
      slideBox.css('-webkit-transform','translate3d('+ -(myIndex-1) * winW +'px,0,0)');
    }
    //向右滑动，前一页
    if(myIndex!=1 && x>=50){
      slideBox.css('-webkit-transform','translate3d('+ -(myIndex-2) * winW +'px,0,0)');
      $('.slide_stage').removeClass('active');
      $(this).prev('.slide_stage').addClass('active');
    }
    if(myIndex==1 && x>=50){
      $('#homepage').addClass('active');
      $('.slide_stage').removeClass('active');
    }

  });


  //左右抽屉式菜单交互效果
  var closebg = $('#closebg');
  function menuclose(){
    $('#menu_btn').removeClass();
    menubox.removeClass();
    $('#content_btn').removeClass();
    $('#contentsbox').removeClass();
    closebg.removeClass();
  }

  //目录按钮
  $('#content_btn').on('tap',function(event){
    event.stopPropagation();
    menuclose();
    $(this).addClass('active');
    $('#contentsbox').addClass('active');
    closebg.addClass('active');
  })

  //菜单按钮
  $('#menu_btn').on('tap',function(event){
    event.stopPropagation();
    menuclose();
    $(this).addClass('active');
    menubox.addClass('active');
    closebg.addClass('active');
  });

  //复位菜单
  $('#closebg').on('tap',function(){
    menuclose();
  })
  menubox.on('tap','.close',function(){
    menuclose();
  })
  $('#contentsbox').on('tap','.close',function(){
    menuclose();
  })

  //目录跳转
  content.on('tap','a',function(){
    var contIndex = $(this).data('index');
    slideBox.css('-webkit-transform','translate3d('+ -(contIndex-1) * winW +'px,0,0)');
    menuclose();
    slideBox.removeClass('autoslide');
    $('.slide_stage').removeClass('active');
    $('#stage'+contIndex).addClass('active');
    $('#homepage').removeClass('active');
    pageNum();
  });

  //阻止页面内部元素冒泡
  $('.no_slide').on('touchstart',function(event){
    event.stopPropagation();
  }).on('touchmove',function(event){
    event.stopPropagation();
  }).on('touchend',function(event){
    event.stopPropagation();
  });


  //页头菜单  底部进度条
  $('#maxpage').html(lastStage);

  function pageNum(){
    var curpage =  $('.slide_stage.active').attr('id');
    $('#curpage').html(curpage.substr(5));

    $('#titlebox').html(pageTitle[curpage]);

    var proLength = $('#progress_bar').width()-$('#progress_bar').find('.bar').width();
    var stepLength = proLength/(lastStage-1);
    $('#progress_bar').find('.bar').css('left',stepLength*(curpage.substr(5)-1));
  };

  //分享功能
  menubox.on('tap','#share_link',function(){
    $('#share_tip').addClass('active');
    menuclose();
  });
  $('#share_tip').on('tap',function(){
    $('#share_tip').attr('class','');
  })

  //收藏功能
  menubox.on('tap','#shoucang_link',function() {
    $.ajax({
      type : 'get',
      url : ctx + '/api/hy/scj/add?source_id='
          + id + '&type=1',
      dataType : 'json',
      success : function(data) {
        $('#shoucang_tip').addClass('active');
      }
    })

    menuclose();
  });
  $('#shoucang_tip').on('tap','.close',function(){
    $('#shoucang_tip').removeClass('active');
  });




});







