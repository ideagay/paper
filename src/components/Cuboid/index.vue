<template>
    <div>
        <h1>长方体</h1>
        <p>单位：厘米cm</p>
        <el-form ref="form" :model="form" label-width="100px" style="width: 60%;">
            <el-form-item label="长" prop="long">
                <el-input v-model="form.long" clearable></el-input>
            </el-form-item>
            <el-form-item label="宽" prop="width">
                <el-input v-model="form.width" clearable></el-input>
            </el-form-item>
            <el-form-item label="高" prop="height">
                <el-input v-model="form.height" clearable></el-input>
            </el-form-item>
            <el-form-item label="黏贴处宽度" prop="jointWidth">
                <el-input v-model="form.jointWidth" clearable></el-input>
            </el-form-item>
            <el-form-item label="颜色" prop="color.hex">
                <el-input v-model="form.color.hex" clearable readonly @click.native="colorShow = !colorShow"></el-input>
            </el-form-item>
            <el-form-item>
                <chrome-picker v-model="form.color" v-if="colorShow"></chrome-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit">立即绘制</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="canvas">
            <h2>A4 210毫米×297毫米 输出分辨率{{outputDpi}}像素/英寸 </h2>
            <canvas id="canvas" ref="canvas" width="842" height="595" style="border:1px solid #c3c3c3;">
                <p>您的浏览器不支持canvas</p>
            </canvas>
        </div>
    </div>
</template>

<script>
import { Chrome } from 'vue-color';

const outputDpi = 72;
let ratio = 1;
const getPixelRatio = function (context) {
    var backingStore = context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore;
};

const cmToPx = function (cm) {
    return Number((cm / 2.54 * outputDpi * ratio).toFixed(2));
}
// 1英寸 = 2.54 21/2.54*dpi
export default {
    name: 'cuboid',
    data () {
        return {
            form: {
                long: 8,
                width: 6,
                height: 4,
                jointWidth: 1.2,
                padding: 1,
                cutWidth: 0.5,
                color: {
                    hex: '#333'
                }
            },
            colorShow: false,
            outputDpi: outputDpi
        };
    },
    components: {
        'chrome-picker': Chrome
    },
    methods: {
        submit () {
            if (this.valid()) {
                this.draw();
            }
        },
        valid () {
            let {width, long, height, jointWidth, padding, cutWidth} = this.form;
            width = Number(width);
            long = Number(long);
            height = Number(height);
            jointWidth = Number(jointWidth);
            if ((padding + jointWidth + height * 2 + long * 2) > 29.7) {
                this.$message({
                    message: '展开长度超出A4纸范围',
                    type: 'error'
                });
                return false;
            }
            if ((padding + height * 2 + width) > 21) {
                this.$message({
                    message: '展开宽度超出A4纸范围',
                    type: 'error'
                });
                return false;
            }
            return true;
        },
        draw () {
            let {width, long, height, jointWidth, padding, cutWidth} = this.form;
            const ctx = this.$refs.canvas.getContext('2d');
            width = cmToPx(width);
            long = cmToPx(long);
            height = cmToPx(height);
            jointWidth = cmToPx(jointWidth);
            padding = cmToPx(padding);
            cutWidth = cmToPx(cutWidth);
            ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
            ctx.fillStyle = this.form.color.hex;
            ctx.fillRect(padding + jointWidth + height, padding + height,
            long, width);
            ctx.fillRect(padding + jointWidth + height,padding,
            long, height);
            ctx.fillRect(padding + jointWidth + height, padding + height + width,
            long, height);
            ctx.fillRect(padding + jointWidth, padding + height,
            height, width);
            ctx.fillRect(padding + jointWidth + height + long, padding + height,
            height, width);
            ctx.fillRect(padding + jointWidth + height * 2 + long, padding + height,
            long, width);
            // 开始绘制连接处
            ctx.setLineDash([5, 6]);
            ctx.beginPath();
            // 连接处1
            ctx.moveTo(padding + jointWidth, padding + height);
            ctx.lineTo(padding, padding + height + cutWidth);
            ctx.lineTo(padding, padding + height + width - cutWidth);
            ctx.lineTo(padding + jointWidth, padding + height + width);
            // 连接处2
            ctx.moveTo(padding + jointWidth, padding + height);
            ctx.lineTo(padding + jointWidth + cutWidth, padding + height - jointWidth);
            ctx.lineTo(padding + jointWidth + height - cutWidth, padding + height - jointWidth);
            ctx.lineTo(padding + jointWidth + height, padding + height);
            // 连接处3
            ctx.moveTo(padding + jointWidth, padding + height + width);
            ctx.lineTo(padding + jointWidth + cutWidth, padding + height + width + jointWidth);
            ctx.lineTo(padding + jointWidth + height - cutWidth, padding + height + width + jointWidth);
            ctx.lineTo(padding + jointWidth + height, padding + height + width);
            // 连接处4
            ctx.moveTo(padding + jointWidth + height + long, padding + height);
            ctx.lineTo(padding + jointWidth + height + long + cutWidth, padding + height - jointWidth);
            ctx.lineTo(padding + jointWidth + height * 2 + long - cutWidth, padding + height - jointWidth);
            ctx.lineTo(padding + jointWidth + height * 2 + long, padding + height);
            ctx.lineTo(padding + jointWidth + height * 2 + long + cutWidth, padding + height - jointWidth);
            ctx.lineTo(padding + jointWidth + height * 2 + long * 2 - cutWidth, padding + height - jointWidth);
            ctx.lineTo(padding + jointWidth + height * 2 + long * 2, padding + height);
            // 连接处5
            ctx.moveTo(padding + jointWidth + height + long, padding + height + width);
            ctx.lineTo(padding + jointWidth + height + long + cutWidth, padding + height + width + jointWidth);
            ctx.lineTo(padding + jointWidth + height * 2 + long - cutWidth, padding + height + width + jointWidth);
            ctx.lineTo(padding + jointWidth + height * 2 + long, padding + height + width);
            ctx.lineTo(padding + jointWidth + height * 2 + long + cutWidth, padding + height + width + jointWidth);
            ctx.lineTo(padding + jointWidth + height * 2 + long * 2 - cutWidth, padding + height + width + jointWidth);
            ctx.lineTo(padding + jointWidth + height * 2 + long * 2, padding + height + width);
            ctx.stroke();
        },
        resetForm () {
            this.$refs.form.resetFields();
        }
    },
    mounted () {
        let canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        ratio = getPixelRatio(ctx);
        canvas.width = (29.7 / 2.54 * outputDpi).toFixed(0);
        canvas.height = (21 / 2.54 * outputDpi).toFixed(0);
        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';
        canvas.width = canvas.width * ratio;
        canvas.height = canvas.height * ratio;
        this.submit();
    }
};
</script>

<style lang="less">
    .canvas {
        width: 100%;
        canvas {
            // width: 100%;
        }
    }
</style>