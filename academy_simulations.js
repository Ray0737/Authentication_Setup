/**
 * ACADEMY TACTICAL SIMULATIONS ENGINE
 * Transitioned from Intania Lab v1.0 to Lieutenant Hecker Industrial Grade
 * 
 * This engine handles interactive physics simulations for:
 * - Kinematics (SUVAT)
 * - Dynamics (FBD / Newton)
 * - Incline Planes
 * - Projectile Motion
 * - Circular Motion
 * - Lami's Theorem
 * - Energy Conservation
 * - Momentum & Collisions
 */

// Physics Canvas Elements
const canvasSuvat = document.getElementById('canvas-suvat');
const ctxSuvat = canvasSuvat ? canvasSuvat.getContext('2d') : null;

const canvasSuvatGraphs = document.getElementById('canvas-suvat-graphs');
const ctxSuvatGraphs = canvasSuvatGraphs ? canvasSuvatGraphs.getContext('2d') : null;

const canvasProj = document.getElementById('canvas-proj');
const ctxProj = canvasProj ? canvasProj.getContext('2d') : null;

const canvasMoment = document.getElementById('canvas-moment');
const ctxMoment = canvasMoment ? canvasMoment.getContext('2d') : null;

const canvasLami = document.getElementById('canvas-lami');
const ctxLami = canvasLami ? canvasLami.getContext('2d') : null;

const canvasFbd = document.getElementById('canvas-fbd');
const ctxFbd = canvasFbd ? canvasFbd.getContext('2d') : null;

const canvasEnergy = document.getElementById('canvas-energy');
const ctxEnergy = canvasEnergy ? canvasEnergy.getContext('2d') : null;

const canvasMomentum = document.getElementById('canvas-momentum');
const ctxMomentum = canvasMomentum ? canvasMomentum.getContext('2d') : null;

const canvasCirc = document.getElementById('canvas-circular');
const ctxCirc = canvasCirc ? canvasCirc.getContext('2d') : null;

const canvasIncline = document.getElementById('canvas-incline');
const ctxIncline = canvasIncline ? canvasIncline.getContext('2d') : null;

let allCanvases = [canvasSuvat, canvasSuvatGraphs, canvasProj, canvasMoment, canvasCirc, canvasIncline, canvasLami, canvasFbd, canvasEnergy, canvasMomentum];

// Utility Resize
function resizeCanvas(canvas) {
    if(!canvas) return;
    const parent = canvas.parentElement;
    if (parent.clientWidth > 0 && parent.clientHeight > 0) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
    }
}

allCanvases.forEach(resizeCanvas);

window.addEventListener('resize', () => {
    allCanvases.forEach(resizeCanvas);
    if(typeof drawMoment === 'function') drawMoment();
    if(typeof drawProjBg === 'function') drawProjBg();
    if(typeof drawInclineBg === 'function') drawInclineBg();
    if(typeof drawSuvatCarsStatic === 'function') drawSuvatCarsStatic();
    if(typeof drawSuvatGraphsBg === 'function') drawSuvatGraphsBg();
    if(typeof drawLamiBg === 'function') drawLamiBg();
});

document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('.accordion-collapse');
    accordions.forEach(collapseEl => {
        collapseEl.addEventListener('shown.bs.collapse', (e) => {
            allCanvases.forEach(resizeCanvas);
            if (e.target.id === 'collapseSUVAT') { if(typeof drawSuvatCarsStatic === 'function') drawSuvatCarsStatic(); if(typeof drawSuvatGraphsBg === 'function') drawSuvatGraphsBg(); }
            if (e.target.id === 'collapseProj') if(typeof drawProjBg === 'function') drawProjBg();
            if (e.target.id === 'collapseMoment') if(typeof drawMoment === 'function') drawMoment();
            if (e.target.id === 'collapseLami') { if(typeof drawLamiBg === 'function') drawLamiBg(); }
            if (e.target.id === 'collapseFBD') { if(typeof drawFbdBg === 'function') drawFbdBg(); }
            if (e.target.id === 'collapseCircular') if(typeof drawCircBg === 'function') drawCircBg();
            if (e.target.id === 'collapseIncline') if(typeof drawInclineBg === 'function') drawInclineBg();
            if (e.target.id === 'collapseEnergy') { if(typeof drawEnergyBg === 'function') drawEnergyBg(); }
            if (e.target.id === 'collapseMomentum') { if(typeof drawMomStatic === 'function') drawMomStatic(); }
        });
    });
});


// --- SUVAT SIMULATION & SOLVER ---
let suvatCars = [];
let suvatReq;
let suvatColors = ['#d90429', '#2b2d42', '#ffb703', '#8d99ae', '#4a4e69'];
let globalTime = 0;

function solveSuvat(known) {
    let { u, v, a, s, t } = known;
    for (let i = 0; i < 5; i++) { 
        if (v === undefined && u !== undefined && a !== undefined && t !== undefined) v = u + a * t;
        if (s === undefined && u !== undefined && a !== undefined && t !== undefined) s = u * t + 0.5 * a * t * t;
        if (s === undefined && u !== undefined && v !== undefined && t !== undefined) s = ((u + v) / 2) * t;
        if (v === undefined && u !== undefined && a !== undefined && s !== undefined) {
            let val = u * u + 2 * a * s;
            if (val >= 0) v = Math.sqrt(val); 
        }
        if (u === undefined && v !== undefined && a !== undefined && t !== undefined) u = v - a * t;
        if (a === undefined && v !== undefined && u !== undefined && t !== undefined && t !== 0) a = (v - u) / t;
        if (t === undefined && v !== undefined && u !== undefined && a !== undefined && a !== 0) t = (v - u) / a;
        if (a === undefined && s !== undefined && u !== undefined && t !== undefined && t !== 0) a = 2 * (s - u * t) / (t * t);
    }
    return { u, v, a, s, t };
}

function updateSuvatListUI() {
    const list = document.getElementById('suvat-list');
    if(!list) return;
    if(suvatCars.length === 0) {
        list.innerHTML = '<div class="text-muted text-center">No cars added.</div>';
        return;
    }
    let html = '';
    suvatCars.forEach((c, idx) => {
        html += `<div class="d-flex justify-content-between align-items-center mb-1">
            <span style="color:${c.color}; font-weight:bold;">Car ${idx+1} [${c.isFreefall ? 'Fall':'Drive'}]</span>
            <span>u:${c.u.toFixed(1)}, a:${c.a.toFixed(1)}, t:${c.t.toFixed(1)}</span>
        </div>`;
    });
    list.innerHTML = html;
}

function drawSuvatCarsStatic() {
    if(!ctxSuvat || canvasSuvat.width === 0) return;
    ctxSuvat.clearRect(0, 0, canvasSuvat.width, canvasSuvat.height);
    
    suvatCars.forEach((c, i) => {
        drawSingleSuvatCar(50, 0, c.isFreefall, i, c.color);
    });
}

function drawSingleSuvatCar(x, s, isFreefall, index, color) {
    if(!ctxSuvat) return;
    
    let trackHeight = 50;
    let cy = 30 + (index * trackHeight);
    
    if (isFreefall) {
        ctxSuvat.beginPath();
        ctxSuvat.arc(50 + (index*40), cy + (s*5), 10, 0, Math.PI * 2);
        ctxSuvat.fillStyle = color;
        ctxSuvat.fill();
        ctxSuvat.fillStyle = '#000';
        ctxSuvat.fillText(s.toFixed(1) + "m", 65 + (index*40), cy + (s*5));
    } else {
        ctxSuvat.beginPath();
        ctxSuvat.moveTo(0, cy + 15);
        ctxSuvat.lineTo(canvasSuvat.width, cy + 15);
        ctxSuvat.strokeStyle = '#dee2e6';
        ctxSuvat.lineWidth = 2;
        ctxSuvat.stroke();
        
        ctxSuvat.fillStyle = color;
        ctxSuvat.fillRect(x, cy - 15, 30, 30);
        
        ctxSuvat.fillStyle = '#fff';
        ctxSuvat.font = "10px Arial";
        ctxSuvat.fillText(s.toFixed(1), x + 2, cy + 5);
    }
}

function drawSuvatGraphsBg() {
    if(!ctxSuvatGraphs || canvasSuvatGraphs.width===0) return;
    ctxSuvatGraphs.clearRect(0, 0, canvasSuvatGraphs.width, canvasSuvatGraphs.height);
    let w = canvasSuvatGraphs.width;
    let h = canvasSuvatGraphs.height;
    
    let secW = w / 3;
    
    ctxSuvatGraphs.strokeStyle = '#adb5bd';
    ctxSuvatGraphs.beginPath();
    ctxSuvatGraphs.moveTo(secW, 0); ctxSuvatGraphs.lineTo(secW, h);
    ctxSuvatGraphs.moveTo(secW*2, 0); ctxSuvatGraphs.lineTo(secW*2, h);
    
    ctxSuvatGraphs.moveTo(0, h-15); ctxSuvatGraphs.lineTo(w, h-15); 
    ctxSuvatGraphs.stroke();
    
    ctxSuvatGraphs.fillStyle = '#6c757d';
    ctxSuvatGraphs.font = "12px sans-serif";
    ctxSuvatGraphs.fillText("s-t", secW/2 - 10, 15);
    ctxSuvatGraphs.fillText("v-t", secW*1.5 - 10, 15);
    ctxSuvatGraphs.fillText("a-t", secW*2.5 - 10, 15);
}

function redrawSuvatGraphs() {
    drawSuvatGraphsBg();
    let w = canvasSuvatGraphs.width;
    let h = canvasSuvatGraphs.height;
    let secW = w / 3;
    let groundY = h - 15;
    
    suvatCars.forEach(c => {
        if(!c.history || c.history.length === 0) return;
        
        ctxSuvatGraphs.strokeStyle = c.color;
        ctxSuvatGraphs.lineWidth = 2;
        
        ctxSuvatGraphs.beginPath();
        c.history.forEach((pts, i) => {
            let px = (pts.t / 10) * secW; 
            let py = groundY - (pts.s * 1.5);
            if(i===0) ctxSuvatGraphs.moveTo(px, py);
            else ctxSuvatGraphs.lineTo(px, py);
        });
        ctxSuvatGraphs.stroke();
        
        ctxSuvatGraphs.beginPath();
        c.history.forEach((pts, i) => {
            let px = secW + (pts.t / 10) * secW; 
            let py = groundY - (pts.v * 3); 
            if(i===0) ctxSuvatGraphs.moveTo(px, Math.max(0, py));
            else ctxSuvatGraphs.lineTo(px, Math.max(0, py));
        });
        ctxSuvatGraphs.stroke();
        
        ctxSuvatGraphs.beginPath();
        c.history.forEach((pts, i) => {
            let px = secW*2 + (pts.t / 10) * secW; 
            let py = groundY - 30 - (pts.a * 3); 
            if(i===0) ctxSuvatGraphs.moveTo(px, py);
            else ctxSuvatGraphs.lineTo(px, py);
        });
        ctxSuvatGraphs.stroke();
    });
}

function addSuvatCar() {
    const ui = {
        u: document.getElementById('sim-suvat-u'),
        v: document.getElementById('sim-suvat-v'),
        a: document.getElementById('sim-suvat-a'),
        s: document.getElementById('sim-suvat-s'),
        t: document.getElementById('sim-suvat-t')
    };

    const isFreefall = document.getElementById('sim-freefall').checked;
    
    let knownVals = {};
    let count = 0;

    for (const key in ui) {
        if (ui[key].value !== '') {
            knownVals[key] = parseFloat(ui[key].value);
            count++;
        }
    }

    if (isFreefall && knownVals.a === undefined) {
        knownVals.a = 9.81;
        count++;
        ui.a.value = 9.81;
    }

    if (count < 3) {
        document.getElementById('suvat-error').classList.remove('d-none');
        return;
    }
    document.getElementById('suvat-error').classList.add('d-none');

    const solved = solveSuvat(knownVals);
    
    let color = suvatColors[suvatCars.length % suvatColors.length];
    
    suvatCars.push({
        u: solved.u || 0,
        v: solved.v || 0,
        a: solved.a || 0,
        s_total: solved.s || 0,
        t: solved.t && solved.t > 0 ? solved.t : 10,
        isFreefall: isFreefall,
        color: color,
        history: [] 
    });
    
    updateSuvatListUI();
    drawSuvatCarsStatic();
    
    for(const key in ui) ui[key].value = '';
}

function playSuvatAll() {
    if(!ctxSuvat || suvatCars.length === 0) return;
    cancelAnimationFrame(suvatReq);
    
    globalTime = 0;
    suvatCars.forEach(c => c.history = []);
    
    let lastStamp = performance.now();
    let maxSimulationTime = Math.max(...suvatCars.map(c => c.t));
    if(maxSimulationTime === 0) maxSimulationTime = 10;
    
    function animate(stamp) {
        const dt = (stamp - lastStamp) / 1000;
        lastStamp = stamp;
        globalTime += dt;
        
        ctxSuvat.clearRect(0,0, canvasSuvat.width, canvasSuvat.height);
        
        let allDone = true;
        
        suvatCars.forEach((c, i) => {
            let activeTime = Math.min(globalTime, c.t);
            if (activeTime < c.t) allDone = false;
            
            let s = (c.u * activeTime) + (0.5 * c.a * activeTime * activeTime);
            let v = c.u + (c.a * activeTime);
            
            c.history.push({t: activeTime, s: s, v: v, a: c.a});
            
            let drawX = 50 + (s * 5); 
            drawSingleSuvatCar(drawX, s, c.isFreefall, i, c.color);
        });
        
        redrawSuvatGraphs();
        
        if (allDone) return; 
        suvatReq = requestAnimationFrame(animate);
    }
    suvatReq = requestAnimationFrame(animate);
}

function stopSuvat() {
    cancelAnimationFrame(suvatReq);
}
function clearSuvat() {
    cancelAnimationFrame(suvatReq);
    suvatCars = [];
    updateSuvatListUI();
    drawSuvatCarsStatic();
    drawSuvatGraphsBg();
}

if (document.getElementById('btn-suvat-add')) {
    document.getElementById('btn-suvat-add').addEventListener('click', addSuvatCar);
    document.getElementById('btn-suvat-play').addEventListener('click', playSuvatAll);
    document.getElementById('btn-suvat-stop').addEventListener('click', stopSuvat);
    document.getElementById('btn-suvat-clear').addEventListener('click', clearSuvat);
    setTimeout(() => { if(typeof drawSuvatCarsStatic === 'function') drawSuvatCarsStatic(); if(typeof drawSuvatGraphsBg === 'function') drawSuvatGraphsBg(); }, 100);
}


// --- PROJECTILE SIMULATION ---
let projObjects = [];
let projReq;
let projColors = ['#ef233c', '#2b2d42', '#ffb703', '#38b000', '#7209b7'];
let pTimeGlobal = 0;

function drawProjBg() {
    if(!ctxProj || canvasProj.width === 0) return;
    ctxProj.clearRect(0,0, canvasProj.width, canvasProj.height);
    
    let groundY = canvasProj.height - 30;
    
    ctxProj.beginPath();
    ctxProj.moveTo(0, groundY);
    ctxProj.lineTo(canvasProj.width, groundY);
    ctxProj.strokeStyle = '#adb5bd';
    ctxProj.lineWidth = 2;
    ctxProj.stroke();
    
    ctxProj.beginPath();
    ctxProj.arc(30, groundY, 5, 0, Math.PI*2);
    ctxProj.fillStyle = '#2b2d42';
    ctxProj.fill();
}

function updateProjListUI() {
    const list = document.getElementById('proj-list');
    if(!list) return;
    if(projObjects.length === 0) {
        list.innerHTML = '<div class="text-muted text-center">No projectiles added.</div>';
        return;
    }
    let html = '';
    projObjects.forEach((p, idx) => {
        html += `<div class="mb-1 border-bottom pb-1">
            <span style="color:${p.color}; font-weight:bold;">Proj ${idx+1} [u:${p.u}, &theta;:${p.angleStr}&deg;, h0:${p.h0}]</span><br>
            <span class="small text-muted">
                H_max: ${p.Hmax.toFixed(2)}m | t: ${p.tTotal.toFixed(2)}s | Sx: ${p.Sx.toFixed(2)}m
            </span>
        </div>`;
    });
    list.innerHTML = html;
}

function addProjectile() {
    const u = parseFloat(document.getElementById('sim-pu').value) || 0;
    const angleDeg = parseFloat(document.getElementById('sim-angle').value) || 0;
    const h0 = parseFloat(document.getElementById('sim-h0').value) || 0;
    const g = parseFloat(document.getElementById('sim-pg').value) || 9.81;
    
    const angleRad = angleDeg * Math.PI / 180;
    const uy = u * Math.sin(angleRad);
    const ux = u * Math.cos(angleRad);
    
    const Hmax = h0 + (uy * uy) / (2 * g);
    
    let a_q = 0.5 * g;
    let b_q = -uy;
    let c_q = -h0;
    
    let tTotal = 0;
    let disc = b_q*b_q - 4*a_q*c_q;
    if(disc >= 0) {
        let t1 = (-b_q + Math.sqrt(disc)) / (2*a_q);
        let t2 = (-b_q - Math.sqrt(disc)) / (2*a_q);
        tTotal = Math.max(t1, t2);
    }
    
    const Sx = ux * tTotal;
    
    projObjects.push({
        u, angleStr: angleDeg, angleRad, h0, g,
        ux, uy, Hmax, tTotal, Sx,
        color: projColors[projObjects.length % projColors.length],
        history: [] 
    });
    
    updateProjListUI();
    drawProjBg(); 
}

function playProjAll() {
    if (!ctxProj || projObjects.length === 0) return;
    cancelAnimationFrame(projReq);
    
    pTimeGlobal = 0;
    projObjects.forEach(p => p.history = []);
    
    let maxSx = Math.max(...projObjects.map(p => p.Sx));
    let maxH = Math.max(...projObjects.map(p => p.Hmax));
    if(maxSx < 10) maxSx = 10;
    if(maxH < 10) maxH = 10;
    
    const startX = 30;
    const groundY = canvasProj.height - 30;
    const availW = canvasProj.width - 60;
    const availH = canvasProj.height - 60;
    
    let scaleX = availW / maxSx;
    let scaleY = availH / maxH;
    let pixelScale = Math.min(scaleX, scaleY); 
    
    let lastStamp = performance.now();
    
    function animate(stamp) {
        const dt = (stamp - lastStamp) / 1000 * 2; 
        lastStamp = stamp;
        pTimeGlobal += dt;
        
        drawProjBg();
        let allDone = true;
        
        projObjects.forEach(p => {
            if(p.history.length > 0) {
                ctxProj.beginPath();
                for(let i=0; i<p.history.length; i++){
                    if(i===0) ctxProj.moveTo(p.history[i].x, p.history[i].y);
                    else ctxProj.lineTo(p.history[i].x, p.history[i].y);
                }
                ctxProj.strokeStyle = p.color + '80'; 
                ctxProj.lineWidth = 2;
                ctxProj.stroke();
            }
        });

        projObjects.forEach(p => {
            let activeTime = Math.min(pTimeGlobal, p.tTotal);
            if (activeTime < p.tTotal) allDone = false;
            
            let sx = p.ux * activeTime;
            let sy = p.h0 + (p.uy * activeTime) - (0.5 * p.g * activeTime * activeTime);
            if(sy < 0 && activeTime >= p.tTotal) sy = 0;
            
            let drawX = startX + (sx * pixelScale);
            let drawY = groundY - (sy * pixelScale);
            
            p.history.push({x: drawX, y: drawY});
            
            ctxProj.beginPath();
            ctxProj.arc(drawX, drawY, 6, 0, Math.PI*2);
            ctxProj.fillStyle = p.color;
            ctxProj.fill();

            if (p.h0 > 0) {
                let pTopY = groundY - (p.h0 * pixelScale);
                ctxProj.beginPath();
                ctxProj.moveTo(startX - 10, pTopY);
                ctxProj.lineTo(startX + 10, pTopY);
                ctxProj.lineTo(startX + 10, groundY);
                ctxProj.lineTo(startX - 10, groundY);
                ctxProj.closePath();
                ctxProj.fillStyle = '#6c757d';
                ctxProj.fill();
            }
        });
        
        if (allDone) return;
        projReq = requestAnimationFrame(animate);
    }
    projReq = requestAnimationFrame(animate);
}

function stopProj() { cancelAnimationFrame(projReq); }
function clearProj() {
    cancelAnimationFrame(projReq);
    projObjects = [];
    updateProjListUI();
    drawProjBg();
}

if (document.getElementById('btn-proj-add')) {
    document.getElementById('btn-proj-add').addEventListener('click', addProjectile);
    document.getElementById('btn-proj-play').addEventListener('click', playProjAll);
    document.getElementById('btn-proj-stop').addEventListener('click', stopProj);
    document.getElementById('btn-proj-clear').addEventListener('click', clearProj);
    setTimeout(drawProjBg, 100);
}


// --- MOMENT & EQUILIBRIUM SIMULATION ---
let forces = []; 

function drawMoment() {
    if (!ctxMoment || canvasMoment.width === 0) return;
    ctxMoment.clearRect(0, 0, canvasMoment.width, canvasMoment.height);

    const cx = canvasMoment.width / 2;
    const cy = canvasMoment.height / 2 + 50;

    let baseAngleDeg = parseFloat(document.getElementById('mom-base-angle') ? document.getElementById('mom-base-angle').value : 0) || 0;
    let baseRad = baseAngleDeg * Math.PI / 180;

    let netMoment = 0;
    forces.forEach(force => {
        let absRad = force.angle * Math.PI / 180;
        let torque = force.f * force.d * Math.sin(absRad - baseRad); 
        netMoment += torque;
    });

    const netMomentEl = document.getElementById('net-moment');
    if (netMomentEl) netMomentEl.innerText = netMoment.toFixed(2);
    
    let tiltRad = 0;
    const statusEl = document.getElementById('moment-status');
    if (Math.abs(netMoment) < 0.05) {
        if(statusEl) {
            statusEl.innerText = "Equilibrium (Balanced)";
            statusEl.className = "text-success fw-bold";
        }
        tiltRad = 0;
    } else {
        if(statusEl) {
            statusEl.innerText = "Not in Equilibrium (Rotating)";
            statusEl.className = "text-danger fw-bold";
        }
        tiltRad = Math.max(Math.min(netMoment * 0.02, Math.PI/6), -Math.PI/6); 
    }

    ctxMoment.beginPath();
    ctxMoment.moveTo(cx, cy);
    ctxMoment.lineTo(cx - 20, cy + 40);
    ctxMoment.lineTo(cx + 20, cy + 40);
    ctxMoment.closePath();
    ctxMoment.fillStyle = '#6c757d';
    ctxMoment.fill();

    ctxMoment.save();
    ctxMoment.translate(cx, cy);
    ctxMoment.rotate(baseRad + tiltRad);

    const scale = 40;
    ctxMoment.fillStyle = '#2b2d42';
    ctxMoment.fillRect(-200, -10, 400, 20);

    ctxMoment.fillStyle = 'rgba(255,255,255,0.5)';
    for(let i=-5; i<=5; i+=1) {
        if(i===0) continue;
        ctxMoment.fillRect(i*scale, -5, 2, 10);
    }

    forces.forEach(force => {
        let drawX = force.d * scale;
        ctxMoment.save();
        ctxMoment.translate(drawX, -10); 
        ctxMoment.rotate(-(baseRad + tiltRad));
        let drawAngle = force.angle * Math.PI / 180; 

        ctxMoment.beginPath();
        let lineLen = Math.min(force.f * 3, 120); 
        let startX = -lineLen * Math.cos(drawAngle);
        let startY = -lineLen * Math.sin(drawAngle);
        
        ctxMoment.moveTo(startX, startY);
        ctxMoment.lineTo(0, 0);
        ctxMoment.strokeStyle = '#d90429';
        ctxMoment.lineWidth = 3;
        ctxMoment.stroke();

        ctxMoment.beginPath();
        ctxMoment.arc(0, 0, 5, 0, Math.PI*2);
        ctxMoment.fillStyle = '#ef233c';
        ctxMoment.fill();
        
        ctxMoment.fillStyle = '#000';
        ctxMoment.font = "12px Arial";
        ctxMoment.fillText(`${force.f}N \u2220${force.angle}°`, startX - 10, startY - 10);
        ctxMoment.restore(); 
    });

    ctxMoment.restore(); 
}

if (document.getElementById('btn-add-force')) {
    document.getElementById('btn-add-force').addEventListener('click', () => {
        const f = parseFloat(document.getElementById('mom-f').value);
        const d = parseFloat(document.getElementById('mom-d').value);
        const angle = parseFloat(document.getElementById('mom-angle').value);

        if(!isNaN(f) && !isNaN(d) && !isNaN(angle)) {
            forces.push({f, d, angle});
            drawMoment();
        }
    });

    document.getElementById('btn-clear-force').addEventListener('click', () => {
        forces = [];
        drawMoment();
    });
    
    if(document.getElementById('mom-base-angle')) {
        document.getElementById('mom-base-angle').addEventListener('input', drawMoment);
    }

    setTimeout(drawMoment, 200);
}

// --- LAMI'S THEOREM SIMULATOR ---
function drawLamiBg() {
    if(!ctxLami || canvasLami.width === 0) return;
    ctxLami.clearRect(0,0, canvasLami.width, canvasLami.height);
}

function processLami() {
    let rawF1 = document.getElementById('lami-f1').value;
    let rawF2 = document.getElementById('lami-f2').value;
    let rawF3 = document.getElementById('lami-f3').value;
    
    let a1 = parseFloat(document.getElementById('lami-a1').value) || 90; 
    let a2 = parseFloat(document.getElementById('lami-a2').value) || 210;
    let a3 = parseFloat(document.getElementById('lami-a3').value) || 330;
    
    let diff23 = Math.abs(a2 - a3); if(diff23 > 180) diff23 = 360 - diff23;
    let diff31 = Math.abs(a3 - a1); if(diff31 > 180) diff31 = 360 - diff31;
    let diff12 = Math.abs(a1 - a2); if(diff12 > 180) diff12 = 360 - diff12;
    
    let sum = diff23 + diff31 + diff12;
    if(Math.abs(sum - 360) > 1) {
        document.getElementById('lami-error').classList.remove('d-none');
        return;
    }
    document.getElementById('lami-error').classList.add('d-none');
    
    let s1 = Math.sin(diff23 * Math.PI/180); 
    let s2 = Math.sin(diff31 * Math.PI/180); 
    let s3 = Math.sin(diff12 * Math.PI/180); 
    
    let K = null;
    if (rawF1 !== '') K = parseFloat(rawF1) / s1;
    else if (rawF2 !== '') K = parseFloat(rawF2) / s2;
    else if (rawF3 !== '') K = parseFloat(rawF3) / s3;
    
    if (K !== null) {
        let f1 = K * s1;
        let f2 = K * s2;
        let f3 = K * s3;
        
        document.getElementById('lami-f1').value = f1.toFixed(2);
        document.getElementById('lami-f2').value = f2.toFixed(2);
        document.getElementById('lami-f3').value = f3.toFixed(2);
        
        drawLamiBg();
        let cx = canvasLami.width / 2;
        let cy = canvasLami.height / 2;
        
        let forcesMap = [
            {f: f1, a: a1, color: '#d90429', opp: diff23},
            {f: f2, a: a2, color: '#ffb703', opp: diff31},
            {f: f3, a: a3, color: '#2b2d42', opp: diff12}
        ];
        
        let maxF = Math.max(f1, f2, f3);
        let pxScale = maxF > 0 ? (Math.min(cx, cy) - 40) / maxF : 1;
        
        ctxLami.save();
        ctxLami.translate(cx, cy);
        
        forcesMap.forEach((v, i) => {
            let rad = v.a * Math.PI/180;
            let drawLen = v.f * pxScale;
            let vx = Math.cos(rad) * drawLen;
            let vy = -Math.sin(rad) * drawLen; 
            
            ctxLami.beginPath();
            ctxLami.moveTo(0,0);
            ctxLami.lineTo(vx, vy);
            ctxLami.strokeStyle = v.color;
            ctxLami.lineWidth = 4;
            ctxLami.stroke();
            
            let arrAngle = Math.atan2(vy, vx);
            ctxLami.beginPath();
            ctxLami.moveTo(vx, vy);
            ctxLami.lineTo(vx - 10*Math.cos(arrAngle - Math.PI/6), vy - 10*Math.sin(arrAngle - Math.PI/6));
            ctxLami.lineTo(vx - 10*Math.cos(arrAngle + Math.PI/6), vy - 10*Math.sin(arrAngle + Math.PI/6));
            ctxLami.closePath();
            ctxLami.fillStyle = v.color;
            ctxLami.fill();
            
            ctxLami.fillStyle = '#000';
            ctxLami.font = "bold 14px Arial";
            ctxLami.fillText(`F${i+1}=${v.f.toFixed(1)}N`, vx + (vx>0?10:-40), vy + (vy>0?15:-5));
        });
        
        ctxLami.beginPath();
        ctxLami.arc(0,0, 6, 0, Math.PI*2);
        ctxLami.fillStyle = '#333';
        ctxLami.fill();
        ctxLami.restore();
    }
}

if(document.getElementById('btn-lami-calc')) {
    document.getElementById('btn-lami-calc').addEventListener('click', processLami);
    setTimeout(drawLamiBg, 200);
}


// --- CIRCULAR MOTION SIMULATION ---
let circReq;
let cTime = 0;

function drawCircBg() {
    if(!ctxCirc || canvasCirc.width === 0) return;
    ctxCirc.clearRect(0,0, canvasCirc.width, canvasCirc.height);
    ctxCirc.beginPath();
    ctxCirc.arc(canvasCirc.width/2, canvasCirc.height/2, 80, 0, Math.PI*2);
    ctxCirc.strokeStyle = '#dee2e6';
    ctxCirc.lineWidth = 2;
    ctxCirc.stroke();
}

function startCircular() {
    if (!ctxCirc || canvasCirc.width === 0) return;
    cancelAnimationFrame(circReq);
    
    const m = parseFloat(document.getElementById('circ-m').value) || 1;
    const r = parseFloat(document.getElementById('circ-r').value) || 2;
    const omega = parseFloat(document.getElementById('circ-omega').value) || 1;
    
    const v = omega * r;
    const ac = (v * v) / r;
    const fc = m * ac;
    const f = omega / (2 * Math.PI);
    const t = 1 / f;
    
    document.getElementById('circ-v').innerText = v.toFixed(2);
    document.getElementById('circ-ac').innerText = ac.toFixed(2);
    document.getElementById('circ-fc').innerText = fc.toFixed(2);
    document.getElementById('circ-f').innerText = f.toFixed(2);
    document.getElementById('circ-t').innerText = t.toFixed(2);
    
    const cx = canvasCirc.width / 2;
    const cy = canvasCirc.height / 2;
    const drawR = 80;
    
    cTime = 0;
    let lastStamp = performance.now();
    
    function animate(stamp) {
        const dt = (stamp - lastStamp) / 1000;
        lastStamp = stamp;
        cTime += dt;
        
        drawCircBg();
        let angle = omega * cTime;
        let bx = cx + Math.cos(angle) * drawR;
        let by = cy - Math.sin(angle) * drawR;
        
        ctxCirc.beginPath();
        ctxCirc.moveTo(cx, cy);
        ctxCirc.lineTo(bx, by);
        ctxCirc.strokeStyle = '#adb5bd';
        ctxCirc.stroke();
        
        ctxCirc.beginPath();
        ctxCirc.arc(bx, by, 10, 0, Math.PI*2);
        ctxCirc.fillStyle = '#d90429';
        ctxCirc.fill();
        
        circReq = requestAnimationFrame(animate);
    }
    circReq = requestAnimationFrame(animate);
}

if(document.getElementById('btn-circ-calc')) {
    document.getElementById('btn-circ-calc').addEventListener('click', startCircular);
    setTimeout(drawCircBg, 200);
}

// --- INCLINE PLANE ---
function drawInclineBg() {
    if(!ctxIncline || canvasIncline.width === 0) return;
    ctxIncline.clearRect(0,0, canvasIncline.width, canvasIncline.height);
}

function solveIncline() {
    const angle = parseFloat(document.getElementById('inc-angle').value) || 0;
    const m = parseFloat(document.getElementById('inc-m').value) || 0;
    const mu = parseFloat(document.getElementById('inc-mu').value) || 0;
    const g = 9.81;
    
    const rad = angle * Math.PI / 180;
    const mgsin = m * g * Math.sin(rad);
    const f_max = mu * m * g * Math.cos(rad);
    
    let a = 0;
    let status = "";
    if (mgsin > f_max) {
        a = g * (Math.sin(rad) - mu * Math.cos(rad));
        status = "Sliding Down (ไถลลง)";
    } else {
        a = 0;
        status = "Static (หยุดนิ่ง)";
    }
    
    document.getElementById('inc-mgsin').innerText = mgsin.toFixed(2);
    document.getElementById('inc-f').innerText = f_max.toFixed(2);
    document.getElementById('inc-status').innerText = status;
    document.getElementById('inc-a').innerText = a.toFixed(2);
    
    drawInclineBg();
    const cx = 50;
    const cy = canvasIncline.height - 50;
    const len = 300;
    const ex = cx + Math.cos(rad) * len;
    const ey = cy - Math.sin(rad) * len;
    
    ctxIncline.beginPath();
    ctxIncline.moveTo(cx, cy);
    ctxIncline.lineTo(ex, ey);
    ctxIncline.lineTo(ex, cy);
    ctxIncline.closePath();
    ctxIncline.strokeStyle = '#2b2d42';
    ctxIncline.lineWidth = 3;
    ctxIncline.stroke();
    
    ctxIncline.save();
    ctxIncline.translate(ex, ey);
    ctxIncline.rotate(-rad);
    ctxIncline.fillStyle = '#ef233c';
    ctxIncline.fillRect(-20, -20, 20, 20);
    ctxIncline.restore();
}

if(document.getElementById('btn-inc-play')) {
    document.getElementById('btn-inc-play').addEventListener('click', solveIncline);
}

// --- FBD / NEWTON ---
let fbdForces = [];
function drawFbdBg() {
    if(!ctxFbd || canvasFbd.width === 0) return;
    ctxFbd.clearRect(0,0, canvasFbd.width, canvasFbd.height);
}

function calculateFBD() {
    const m = parseFloat(document.getElementById('fbd-m').value) || 1;
    let sumX = 0;
    let sumY = 0;
    
    fbdForces.forEach(f => {
        let rad = f.angle * Math.PI / 180;
        sumX += f.f * Math.cos(rad);
        sumY += f.f * Math.sin(rad);
    });
    
    const net = Math.sqrt(sumX*sumX + sumY*sumY);
    const angle = Math.atan2(sumY, sumX) * 180 / Math.PI;
    const a = net / m;
    
    document.getElementById('fbd-sumx').innerText = sumX.toFixed(2);
    document.getElementById('fbd-sumy').innerText = sumY.toFixed(2);
    document.getElementById('fbd-net').innerText = net.toFixed(2);
    document.getElementById('fbd-net-angle').innerText = angle.toFixed(1);
    document.getElementById('fbd-a').innerText = a.toFixed(2);
    
    drawFbdBg();
    const cx = canvasFbd.width / 2;
    const cy = canvasFbd.height / 2;
    
    ctxFbd.fillStyle = '#2b2d42';
    ctxFbd.fillRect(cx - 30, cy - 30, 60, 60);
    
    fbdForces.forEach(f => {
        let rad = f.angle * Math.PI / 180;
        let len = Math.min(f.f * 2, 120);
        let vx = Math.cos(rad) * len;
        let vy = -Math.sin(rad) * len;
        
        ctxFbd.beginPath();
        ctxFbd.moveTo(cx, cy);
        ctxFbd.lineTo(cx + vx, cy + vy);
        ctxFbd.strokeStyle = '#ef233c';
        ctxFbd.lineWidth = 3;
        ctxFbd.stroke();
    });
}

if(document.getElementById('btn-fbd-add')) {
    document.getElementById('btn-fbd-add').addEventListener('click', () => {
        const f = parseFloat(document.getElementById('fbd-f').value);
        const a = parseFloat(document.getElementById('fbd-angle').value);
        if(!isNaN(f) && !isNaN(a)) {
            fbdForces.push({f, angle: a});
            calculateFBD();
        }
    });
    document.getElementById('btn-fbd-clear').addEventListener('click', () => {
        fbdForces = [];
        calculateFBD();
    });
}

// --- ENERGY CONSERVATION ---
let energyReq;
function drawEnergyBg() {
    if(!ctxEnergy || canvasEnergy.width === 0) return;
    ctxEnergy.clearRect(0,0, canvasEnergy.width, canvasEnergy.height);
}

function playEnergy() {
    cancelAnimationFrame(energyReq);
    const m = parseFloat(document.getElementById('energy-m').value) || 10;
    const h0 = parseFloat(document.getElementById('energy-h').value) || 50;
    const g = 9.81;
    let energyTime = 0;
    let lastStamp = performance.now();
    
    function animate(stamp) {
        const dt = (stamp - lastStamp) / 1000;
        lastStamp = stamp;
        energyTime += dt;
        
        let h = h0 - 0.5 * g * energyTime * energyTime;
        if(h < 0) h = 0;
        let v = g * energyTime;
        if(h === 0) v = Math.sqrt(2 * g * h0);
        
        let ep = m * g * h;
        let ek = 0.5 * m * v * v;
        
        document.getElementById('en-h').innerText = h.toFixed(2);
        document.getElementById('en-v').innerText = v.toFixed(2);
        document.getElementById('en-ep').innerText = ep.toFixed(0);
        document.getElementById('en-ek').innerText = ek.toFixed(0);
        document.getElementById('en-total').innerText = (ep + ek).toFixed(0);
        
        drawEnergyBg();
        const groundY = canvasEnergy.height - 30;
        const drawH = h * 5;
        ctxEnergy.beginPath();
        ctxEnergy.arc(canvasEnergy.width/2, groundY - drawH, 15, 0, Math.PI*2);
        ctxEnergy.fillStyle = '#ef233c';
        ctxEnergy.fill();
        
        if(h > 0) energyReq = requestAnimationFrame(animate);
    }
    energyReq = requestAnimationFrame(animate);
}

if(document.getElementById('btn-energy-play')) {
    document.getElementById('btn-energy-play').addEventListener('click', playEnergy);
}

// --- MOMENTUM ---
function drawMomStatic() {
    if(!ctxMomentum || canvasMomentum.width === 0) return;
    ctxMomentum.clearRect(0,0, canvasMomentum.width, canvasMomentum.height);
}

function playMomentum() {
    const m1 = parseFloat(document.getElementById('mom-m1').value);
    const u1 = parseFloat(document.getElementById('mom-u1').value);
    const m2 = parseFloat(document.getElementById('mom-m2').value);
    const u2 = parseFloat(document.getElementById('mom-u2').value);
    
    const v1 = ((m1 - m2) * u1 + 2 * m2 * u2) / (m1 + m2);
    const v2 = ((m2 - m1) * u2 + 2 * m1 * u1) / (m1 + m2);
    
    document.getElementById('mom-v1').innerText = v1.toFixed(2);
    document.getElementById('mom-v2').innerText = v2.toFixed(2);
    document.getElementById('mom-status').innerText = "Collision Successful (ชนสำเร็จแล้ว)";
    
    drawMomStatic();
    const cy = canvasMomentum.height / 2;
    ctxMomentum.fillStyle = '#007bff';
    ctxMomentum.fillRect(50, cy - 20, 40, 40);
    ctxMomentum.fillStyle = '#dc3545';
    ctxMomentum.fillRect(canvasMomentum.width - 90, cy - 20, 40, 40);
}

if(document.getElementById('btn-mom-play')) {
    document.getElementById('btn-mom-play').addEventListener('click', playMomentum);
}
