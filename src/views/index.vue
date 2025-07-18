<template>
  <div class="container">
    <div class="top-card-div">

        <el-card class="one-card" style="width: 520px;height: 108px;border-radius: 10px;" shadow="always">
          <div class="icon-div">
              <el-icon class="setting-icon"><Setting /></el-icon>
          </div>
          <div>
              设备总数
          </div>
        </el-card>
        <el-card class="four-cards" shadow="always">
          设备总数
        </el-card>
        <el-card class="four-cards" shadow="always">
          设备总数
        </el-card>
        <el-card class="four-cards" shadow="always">
          设备总数
        </el-card>
        <el-card class="four-cards" shadow="always">
          设备总数
        </el-card>
    </div>

  </div>
</template>

<script setup>

</script>
<style scoped lang="scss">
  .container{
    width: 100vw;
    height: 100vh;
    padding: 32px 32px 0 32px;
    background-color: #eff1f4;
  }
  .top-card-div{
    display: flex;
    justify-content: space-around;
    width: 1681px;
    height: 140px;
  }
  .four-cards{
    width: 240px;
    height: 108px;
    border-radius: 10px;
  }
  .one-card{
    display: flex;
  }
  .icon-div{
    width: 80px;
    height: 80px;
    font-size: 40px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .setting-icon{
    width: 43px;
    height: 43px;
    background-color: #1296db;
    border-radius: 7px;
  }
</style>

