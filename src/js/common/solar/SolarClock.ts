import { MathUtils } from "@jocabola/math";
import { Clock } from "three";
import { SolarTimeManager } from "./SolarTime";

const HRSPSEC = 60*60*1000;

/**
 * Solar Clock
 * This class takes care of handling the simulation clock
 */
export class SolarClock {
    private iClock:Clock;
    private date:Date;
    private paused:boolean = false;
    private started:boolean = false
    private elapsedTime:number = 0;
    private speed:number = 1;
    private targetSpeed:number = 1;

    /**
     * 
     * @param clock - internal clock for handling ellapsed time
     */
    constructor(clock:Clock) {
        this.iClock = clock;
        this.date = new Date();
        this.iClock.stop();
    }

    /**
     * Elapsed time
     */
    get time():number {
        return this.elapsedTime;
    }

    /**
     * Sets the number of hours equivalent per second.
     * 0 means real-time, 1 one hour per second, 2 two hours per second, etc.
     */
    set secsPerHour(speed:number) {
        // const v = Math.max(0, value);
        this.targetSpeed = speed;
    }

    /**
     * The number of hours equivalent per second.
     * 0 means real-time, 1 one hour per second, 2 two hours per second, etc.
     */
    get secsPerhour():number {
        return this.targetSpeed;
    }

    /**
     * Whether the clock is playing or not
     */
    get playing():boolean {
        return !this.paused && this.started;
    }

    /**
     * Starts internal clock
     * 
     * @param date - The date where the simulation needs to start. Default: now
     */
    start(date:Date=new Date()) {
        if(this.started) return;
        this.elapsedTime = 0;
        this.date = date;
        this.iClock.start();
        this.paused = false;
        this.started = true;
    }

    /**
     * Starts internal clock
     * 
     * @param date - The date where the simulation needs to be set. Default: now
     */
    setDate(date:Date=new Date()) {
        this.date = date;
    }

    /**
     * Stops internal clock
     */
    stop() {
        if(!this.started) return;
        this.iClock.stop();
        this.started = false;
    }

    /**
     * Pauses clock
     */
    pause() {
        if(!this.started) return;
        if(this.paused) return;
        this.paused = true;
        this.elapsedTime = this.iClock.elapsedTime;
        this.iClock.stop();
    }

    /**
     * Resumes clock
     */
    resume() {
        if(!this.started) return;
        if(!this.paused) return;
        this.paused = false;
        this.iClock.start();
    }

    /**
     * Updates clock
     * 
     * @returns current MJD
     */
    update(): number {
        const dt = this.iClock.getDelta();

        if(!this.paused && this.iClock.running) {
            this.elapsedTime = this.iClock.getElapsedTime();
        }

        if(Math.abs(this.targetSpeed-this.speed) < .01) {
            this.speed = this.targetSpeed;
        } else {
            this.speed = MathUtils.lerp(this.speed, this.targetSpeed, .16);
        }
        
        this.date.setTime(this.date.getTime() + dt * 1000 + this.speed * HRSPSEC * dt);

        return SolarTimeManager.getMJDonDate(this.date);
    }

}