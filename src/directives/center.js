export default{
  inserted(el){
    el.style.position = "fixed"
    el.style.top = "50%"
    el.style.left = "50%"
    el.style.transform = "translateX(-50%) translateY(-50%)"
  }
}