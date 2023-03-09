<template>
    <div class="excel-upload">
        <input
            ref="excel-upload-input"
            class="excel-upload-input"
            type="file"
            accept=".xlsx, .xls"
            @change="handleClick"
        />
        <el-button type="primary" @click="handleUpload">{{ title }}</el-button>
    </div>
</template>

<script>
// import XLSX from 'xlsx';

export default {
    props: {
        succeed: Function, // eslint-disable-line
        title: {
            type: String,
            default: '100px'
        }
    },
    data() {
        return {};
    },
    methods: {
        handleUpload() {
            this.$refs['excel-upload-input'].click();
        },
        handleClick(e) {
            const files = e.target.files;
            const rawFile = files[0]; // only use files[0]
            if (!this.isExcel(rawFile)) {
                this.$message.error('只能上传 .xlsx,.xls 类型的文件');
                return false;
            }
            if (!rawFile) return;

            let fileName = rawFile.name;
            let fd = new FormData();
            fd.append('file', rawFile);
            this.upload(fd, fileName);
        },
        upload(fd, fileName) {
            this.$emit('succeed', { fd, fileName });
        },
        isExcel(file) {
            return /\.(xlsx|xls)$/.test(file.name);
        }
    }
};
</script>

<style scoped>
.excel-upload {
    display: inline-block;
}
.excel-upload-input {
    display: none;
    z-index: -9999;
}
</style>
