init()
animate()

function init() {

    document.addEventListener('contextmenu', event => event.preventDefault());

    colors = ["#ffffff", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#880000", "#008800", "#000088", "#888800", "#880088", "#008888", "#888888", "#ff8800", "#00ff88", "#8800ff", "#88ff00", "#0088ff", "#ff0088"]

    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")
    ctx.textAlign = "left"

    ctx.font = "32px Arial"

    data = []
    classes = []

    start = false
    convergence = 0

    maj_centre = false

    iterations = 0
    nb_points = 5*(2+Math.round(18*Math.random()))
    K = Math.round(2+4*Math.random())

    x_plus_K = 140
    y_plus_K = 40
    x_moins_K = 190
    y_moins_K = 40

    x_plus_pts = 390
    y_plus_pts = 80
    x_moins_pts = 440
    y_moins_pts = 80

    for (let i = 0; i < 100; i++) {
        data.push({"x": 50+900*Math.random(), "y": 110+500*Math.random(), "r": 8, "classe": 0})
    }

    previous_data = JSON.parse(JSON.stringify(data))

    for (let i = 0; i < 10; i++) {
        classes.push({"x": -50, "y": -50, "x_print": -50, "y_print": -50, "r": 14, "classe": i+1})
    }

    xyMouse = {"x": 0, "y": 0}
    xyMouseUp = {"x": 0, "y": 0}
    xyClick = {"x": 0, "y": 0}

    canvas.addEventListener('mousemove', function(event) {
        event.preventDefault()
        xyMouse = getMousePos(canvas, event)
    }, false)

    canvas.addEventListener('mouseup', function(event) {
        event.preventDefault()
        xyMouseUp = getMousePos(canvas, event)
    }, false)

    canvas.addEventListener('mousedown', function(event) {
        event.preventDefault()
        xyClick = getMousePos(canvas, event)

        if (!start && (xyClick.x - x_plus_K)**2 + (xyClick.y - y_plus_K)**2 < 900) {
            K = Math.min(K+1, 10)
        } else if (!start && (xyClick.x - x_moins_K)**2 + (xyClick.y - y_moins_K)**2 < 900) {
            K = Math.max(K-1, 2)
        } else if (!start && (xyClick.x - x_plus_pts)**2 + (xyClick.y - y_plus_pts)**2 < 900) {
            nb_points = Math.min(nb_points+5, 100)
        } else if (!start && (xyClick.x - x_moins_pts)**2 + (xyClick.y - y_moins_pts)**2 < 900) {
            nb_points = Math.max(nb_points-5, 10)
        } else if (!start && (xyClick.x > 700 && xyClick.x < 960 && xyClick.y >= 10 && xyClick.y <= 50)) {
            start = true
            initialiser()
        } else if (start && !maj_centre && convergence == 0 && (xyClick.x > 700 && xyClick.x < 960 && xyClick.y > 50 && xyClick.y <= 90)) {
            iteration()
        } else if (start && maj_centre && convergence == 0 && (xyClick.x > 700 && xyClick.x < 1080 && xyClick.y > 50 && xyClick.y <= 90)) {
            maj_centres()
        }
    }, false)

}


function initialiser() {
    for (let i = 0; i < K; i++) {
        random_data_idx = Math.floor(nb_points*Math.random())
        while (data[random_data_idx].classe > 0) {
            random_data_idx = Math.floor(nb_points*Math.random())
        }
        data[random_data_idx].classe = i+1
        classes[i].x = data[random_data_idx].x
        classes[i].y = data[random_data_idx].y
        classes[i].x_print = data[random_data_idx].x
        classes[i].y_print = data[random_data_idx].y
    }
}


function animate() {

    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = 1
    ctx.strokeStyle = "#000000"
    ctx.fillStyle = "#ffffff"
    ctx.strokeText("k = " + K, 50, 40)
    ctx.fillText("k = " + K, 50, 40)

    ctx.font = "20px Arial"
    ctx.strokeText("Par Thierry Malon", 50, 660)
    ctx.fillText("Par Thierry Malon", 50, 660)
    ctx.font = "32px Arial"

    if (!start) {
        ctx.strokeText("+", x_plus_K, y_plus_K)
        ctx.fillText("+", x_plus_K, y_plus_K)
        ctx.strokeText("−", x_moins_K, y_moins_K)
        ctx.fillText("−", x_moins_K, y_moins_K)

        ctx.strokeText("+", x_plus_pts, y_plus_pts)
        ctx.fillText("+", x_plus_pts, y_plus_pts)
        ctx.strokeText("−", x_moins_pts, y_moins_pts)
        ctx.fillText("−", x_moins_pts, y_moins_pts)

        ctx.strokeText("Lancer k-means", 700, 40)
        ctx.fillText("Lancer k-means", 700, 40)
    } else if (iterations == 0) {
        ctx.strokeText("Initialisation des centres", 700, 40)
        ctx.fillText("Initialisation des centres", 700, 40)
    } else if (iterations > 0) {
        ctx.strokeText("Itérations : " + iterations, 700, 40)
        ctx.fillText("Itérations : " + iterations, 700, 40)
    }

    if (start && !maj_centre && convergence == 0) {
        ctx.strokeText("Faire une itération", 700, 80)
        ctx.fillText("Faire une itération", 700, 80)
    } else if (start && maj_centre && convergence == 0) {
        ctx.strokeText("Mettre à jour les centres", 700, 80)
        ctx.fillText("Mettre à jour les centres", 700, 80)
    } else if (convergence > 0) {
        ctx.strokeText("Convergence atteinte", 700, 80)
        ctx.fillText("Convergence atteinte", 700, 80)
    }

    ctx.strokeText("Nombre de points : " + nb_points, 50, 80)
    ctx.fillText("Nombre de points : " + nb_points, 50, 80)

    if (iterations == 0) {
        ctx.strokeText("Nombre de points : " + nb_points, 50, 80)
        ctx.fillText("Nombre de points : " + nb_points, 50, 80)
    }

    for (let i = 0; i < nb_points; i++) {
        pt = data[i]
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, pt.r, 0, 2*Math.PI)
        ctx.stroke()
        ctx.fillStyle = colors[pt.classe]
        ctx.fill()
    }

    for (let i = 0; i < K; i++) {
        classes[i].x_print = 0.1*classes[i].x + 0.9*classes[i].x_print
        classes[i].y_print = 0.1*classes[i].y + 0.9*classes[i].y_print
        pt = classes[i]
        ctx.beginPath()
        ctx.arc(pt.x_print, pt.y_print, pt.r, 0, 2*Math.PI)
        ctx.globalAlpha = 0.7
        ctx.stroke()
        ctx.fillStyle = colors[pt.classe]
        ctx.fill()
        ctx.globalAlpha = 1
    }

}


function iteration() {
    for (let i = 0; i < nb_points; i++) {
        d_min = 10000000
        idx_min = 0
        for (let k = 0; k < K; k++) {
            dist = (classes[k].x - data[i].x)**2 + (classes[k].y - data[i].y)**2
            if (dist < d_min) {
                d_min = dist
                idx_min = k+1
            }
        }
        data[i].classe = idx_min
    }

    maj_centre = true

    iterations+=1

    identique = true

    for (let i = 0; i < data.length; i++) {
        if (data[i].classe !== previous_data[i].classe) {
            identique = false
        }
    }

    if (identique) {
        convergence = iterations
    }

    previous_data = JSON.parse(JSON.stringify(data))
}


function maj_centres() {

    for (let k = 0; k < K; k++) {
        pt_moyen = {"x": 0, "y": 0, "nb": 0}
        for (let i = 0; i < nb_points; i++) {
            if (data[i].classe == k+1) {
                pt_moyen.x += data[i].x
                pt_moyen.y += data[i].y
                pt_moyen.nb += 1
            }
        }

        if (pt_moyen.nb > 0) {
            classes[k].x = pt_moyen.x / pt_moyen.nb
            classes[k].y = pt_moyen.y / pt_moyen.nb
        }
    }

    maj_centre = false
}


function getMousePos(c, event) {
    var rect = c.getBoundingClientRect()
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
}


