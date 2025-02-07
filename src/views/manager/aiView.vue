<template>
  <div class="talkContent">
    <div class="talkFlex">
      <div class="talkShow">
        <div :class="[(item.person=='mechanical')?'mechanicalTalk':'mineTalk']" v-for="(item,index) in talkList" :key="index">
            <span>{{item.say}}</span>
        </div>
      </div>
    </div>

    <div class="talkInput">
      <form @submit.prevent="getQuestion" class="userSearch">
        <div class="input-wrapper">
          <el-input
            autosize
            size="small"
            type="textarea"
            placeholder="请输入内容"
            v-model="contentVal"
          />
          <i class="el-icon-position submit-icon" style="cursor: pointer;" @click="getQuestion" />
        </div>
      </form>
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      talkList: [
        { id:"1", person: 'mechanical', say: '你好，有什么可以帮到你呢？' },
      ],
      isMine: 1,
      contentVal: '',
    };
  },
  updated() {
		this.scrollToBottom();
	},
  methods: {
    scrollToBottom() {
			this.$nextTick(()=> {
				let box = this.$el.querySelector(".talkShow");
				box.scrollTop = box.scrollHeight;
			})
		},
    getQuestion() {
      if (this.contentVal == '') {
        this.$message.error('请输入内容');
        return;
      }
      // admin提问数据push()
      this.talkList.push({ id: Date.now(), person:'admin', say: this.contentVal });
      // 清空输入栏数据
      this.contentVal = '';
      this.getAnswer();
    },
    async getAnswer() {
      // 调用API获取回答， 模拟后端返回的数据流式输出
      const data ='文字逐个展示，文字逐个展示，文字逐个展示文字逐个展示文字逐个展示文字逐个展示文字逐个展示文字逐个展示文字逐个展示文字逐个展示文字逐个展示';
      // mechanical 模拟回答
      this.talkList.push({ id: Date.now(), person:'mechanical', say: '...' });
      // 流式输出文字逐个展示
      let text = "";
      const length = this.talkList.length;
      for (let i = 0; i < data.length; i++) {
        text += data.charAt(i);
        await new Promise((resolve) => {
          setTimeout(resolve, 50)
        });
        this.talkList[length - 1].say= text;
      }
    }
  },
};
</script>

<style scoped>

.input-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.submit-icon {
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 1;
}

.talkContent {
  font-size: 14px;
  display: flex;
  flex-flow: column;
}
.talkFlex{
  display: flex;
  justify-content: center;
}
.talkShow {
  width: 60%;
  height: calc(100vh - 80px);
}

.talkInput {
  margin: 10px auto 0;
  display: flex;
  justify-content: center;
  width: 30%;

}
.userSearch{
  width: 100%;
}

.mechanicalTalk {
  margin: 10px;
}

.mechanicalTalk span {
  display: inline-block;
  background: white;
  border-radius: 10px;
  padding: 5px 10px;
  border: 1px solid rgb(214, 216, 219);
  border-top-left-radius: 0px;
  word-break: break-all;
  text-align: left;
}

.mineTalk {
  margin: 10px;
  text-align: right;
}

.mineTalk span {
  display: inline-block;
  border-radius: 10px;
  border-top-right-radius: 0px;
  background: #409eff;
  color: #fff;
  padding: 5px 10px;
  word-break: break-all;
  text-align: left;
}

</style>



