import { animate, createTimeline } from 'animejs'

export default function () {
  // 动画效果
  var canvasEl = document.querySelector("#mousedown");
  if (canvasEl) {
    var ctx = canvasEl.getContext("2d", {willReadFrequently: true})
      , numberOfParticules = 30
      , pointerX = 0
      , pointerY = 0
      , tap = "mousedown"
      , colors = ["#FF1461", "#18FF92", "#5A87FF", "#FBF38C"]
      , setCanvasSize = debounce(function () {
      canvasEl.width = 2 * window.innerWidth,
        canvasEl.height = 2 * window.innerHeight,
        canvasEl.style.width = window.innerWidth + "px",
        canvasEl.style.height = window.innerHeight + "px",
        canvasEl.getContext("2d", {willReadFrequently: true}).scale(2, 2)
    }, 500);
    
    // v4 创建持续清空动画
    animate({
      targets: { val: 0 },
      duration: 1 / 0,
      update: function () {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
      }
    });
    
    document.addEventListener(tap, function (e) {
      "sidebar" !== e.target.id && "toggle-sidebar" !== e.target.id && "A" !== e.target.nodeName && "IMG" !== e.target.nodeName && (
        updateCoords(e),
        animateParticules(pointerX, pointerY))
    }, !1),
      setCanvasSize(),
      window.addEventListener("resize", setCanvasSize, !1)
  }

  function updateCoords(e) {
    pointerX = (e.clientX || e.touches[0].clientX) - canvasEl.getBoundingClientRect().left,
      pointerY = e.clientY || e.touches[0].clientY - canvasEl.getBoundingClientRect().top
  }

  function setParticuleDirection(e) {
    var t = Math.random() * 360 * Math.PI / 180
      , a = Math.random() * 130 + 50
      , n = [-1, 1][Math.floor(Math.random() * 2)] * a;
    return {
      x: e.x + n * Math.cos(t),
      y: e.y + n * Math.sin(t)
    }
  }

  function createParticule(e, t) {
    var a = {};
    return a.x = e,
      a.y = t,
      a.color = colors[Math.floor(Math.random() * colors.length)],
      a.radius = Math.random() * 16 + 16,
      a.endPos = setParticuleDirection(a),
      a.draw = function () {
        ctx.beginPath(),
          ctx.arc(a.x, a.y, a.radius, 0, 2 * Math.PI, !0),
          ctx.fillStyle = a.color,
          ctx.fill()
      }
      ,
      a
  }

  function createCircle(e, t) {
    var a = {};
    return a.x = e,
      a.y = t,
      a.color = "#F00",
      a.radius = .1,
      a.alpha = .5,
      a.lineWidth = 6,
      a.draw = function () {
        ctx.globalAlpha = a.alpha,
          ctx.beginPath(),
          ctx.arc(a.x, a.y, a.radius, 0, 2 * Math.PI, !0),
          ctx.lineWidth = a.lineWidth,
          ctx.strokeStyle = a.color,
          ctx.stroke(),
          ctx.globalAlpha = 1
      }
      ,
      a
  }

  function renderParticule(e) {
    for (var t = 0; t < e.length; t++)
      if (e[t].target && e[t].target.draw) {
        e[t].target.draw()
      }
  }

  function animateParticules(e, t) {
    for (var a = createCircle(e, t), n = [], i = 0; i < numberOfParticules; i++)
      n.push(createParticule(e, t));
    createTimeline().add({
      targets: n,
      x: function (e) {
        return e.endPos.x
      },
      y: function (e) {
        return e.endPos.y
      },
      radius: .1,
      duration: Math.random() * 600 + 1200,
      easing: "easeOutExpo",
      update: function (anim) {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        for (var j = 0; j < n.length; j++) {
          n[j].draw();
        }
        a.draw();
      }
    }).add({
      targets: a,
      radius: Math.random() * 80 + 80,
      lineWidth: 0,
      alpha: {
        value: 0,
        easing: "linear",
        duration: Math.random() * 200 + 600
      },
      duration: Math.random() * 600 + 1200,
      easing: "easeOutExpo",
      offset: 0
    })
  }

  function debounce(fn, delay) {
    var timer
    return function () {
      var context = this
      var args = arguments
      clearTimeout(timer)
      timer = setTimeout(function () {
        fn.apply(context, args)
      }, delay)
    }
  }
}
