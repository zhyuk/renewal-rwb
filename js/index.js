// 스크롤탑
$(function () {
    // ScrollTop
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }


    // var button = document.getElementById('scrollTop');
    // button.addEventListener('click', scrollToTop);

    $("#scrollTop").click(() => {
        scrollToTop();
    })

});

$(function () {
    // 스크롤탑 버튼
    function scrollTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    $("#scrollTop").click(() => {
        scrollTop();
    })

    // 영상 랜덤배열 
    let totalNum = videoSet.childElementCount;
    function randomNum() {
        var i = Math.floor(Math.random() * totalNum) + 1;
        return i;
    }

    var i = randomNum();
    $("#video" + i).removeClass("hide");
})

// window.onload = function () {
//     let totalNum = videoSet.childElementCount;
//     console.log(totalNum);
//     function randomNum() {
//         var i = Math.floor(Math.random() * totalNum) + 1;
//         return i;
//     }
//     var i = randomNum();
//     console.log(i);

//     document.getElementById("video" + i).classList.remove("hide");
// }

// 커서에 따라 등장하는 이미지
const images = document.getElementsByClassName("image");
const section = document.getElementById("intro")

let globalIndex = 0,
    last = { x: 0, y: 0 };

const activate = (image, x, y) => {
    image.style.left = `${x}px`;
    image.style.top = `${y}px`;
    image.style.zIndex = globalIndex;

    image.dataset.status = "active";

    last = { x, y };
}

const distanceFromLast = (x, y) => {
    return Math.hypot(x - last.x, y - last.y);
}

const handleOnMove = e => {
    if (distanceFromLast(e.clientX, e.clientY) > (window.innerWidth / 20)) {
        const lead = images[globalIndex % images.length],
            tail = images[(globalIndex - 5) % images.length];

        activate(lead, e.clientX, e.clientY);

        if (tail) tail.dataset.status = "inactive";

        globalIndex++;
    }
}

section.onmousemove = e => handleOnMove(e);

// section.ontouchmove = e => handleOnMove(e.touches[0]);

// 옆으로 흐르는 텍스트
const pTag = document.querySelector('.move-text')

const textArr = 'RAUH-Welt BEGRIFF | RWB | RAUH-Welt BEGRIFF | RWB | RAUH-Welt BEGRIFF | RWB |'.split(' ')

let count = 0

initTexts(pTag, textArr)

function initTexts(element, textArray) {
    textArray.push(...textArray)
    for (let i = 0; i < textArray.length; i++) {
        element.innerText += `${textArray[i]}\u00A0\u00A0\u00A0\u00A0`
    }
}

function marqueeText(count, element, direction) {
    if (count > element.scrollWidth / 2) {
        element.style.transform = `translate3d(0, 0, 0)`
        count = 0
    }
    element.style.transform = `translate3d(${direction * count}px, 0, 0)`

    return count
}

function moveText() {
    count++

    count = marqueeText(count, pTag, -1)

    window.requestAnimationFrame(moveText)
}

function scrollHandler() {
    count += 40
}

window.addEventListener('scroll', scrollHandler)
moveText()

// 바디킷 이미지
/*--------------------
Vars
--------------------*/
let progress = 80
let startX = 0
let active = 0
let isDown = false

/*--------------------
Contants
--------------------*/
const speedWheel = 0.02
const speedDrag = -0.1

/*--------------------
Get Z
--------------------*/
const getZindex = (array, index) => (array.map((_, i) => (index === i) ? array.length : array.length - Math.abs(index - i)))

/*--------------------
Items
--------------------*/
const $items = document.querySelectorAll('.carousel-item')
const $cursors = document.querySelectorAll('.cursor')

const displayItems = (item, index, active) => {
    const zIndex = getZindex([...$items], active)[index]
    item.style.setProperty('--zIndex', zIndex)
    item.style.setProperty('--active', (index - active) / $items.length)
}

/*--------------------
Animate
--------------------*/
const animate = () => {
    progress = Math.max(0, Math.min(progress, 100))
    active = Math.floor(progress / 100 * ($items.length - 1))

    $items.forEach((item, index) => displayItems(item, index, active))
}
animate()

/*--------------------
Click on Items
--------------------*/
$items.forEach((item, i) => {
    item.addEventListener('click', () => {
        progress = (i / $items.length) * 100 + 10
        animate()
    })
})

/*--------------------
Handlers
--------------------*/
const handleWheel = e => {
    const wheelProgress = e.deltaY * speedWheel
    progress = progress + wheelProgress
    animate()
}

const handleMouseMove = (e) => {
    if (e.type === 'mousemove') {
        $cursors.forEach(($cursor) => {
            $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
        })
    }
    if (!isDown) return
    const x = e.clientX || (e.touches && e.touches[0].clientX) || 0
    const mouseProgress = (x - startX) * speedDrag
    progress = progress + mouseProgress
    startX = x
    animate()
}

const handleMouseDown = e => {
    isDown = true
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0
}

const handleMouseUp = () => {
    isDown = false
}

/*--------------------
Listeners
--------------------*/
document.addEventListener('mousewheel', handleWheel)
document.addEventListener('mousedown', handleMouseDown)
document.addEventListener('mousemove', handleMouseMove)
document.addEventListener('mouseup', handleMouseUp)
document.addEventListener('touchstart', handleMouseDown)
document.addEventListener('touchmove', handleMouseMove)
document.addEventListener('touchend', handleMouseUp)