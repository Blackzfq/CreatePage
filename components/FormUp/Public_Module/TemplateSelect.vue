<template>
    <div>
      <a-select default-value="lucy" @change="handleChange">
        <a-select-option value="jack">
          默认模板
        </a-select-option>
        <a-select-option value="lucy">
          高级模板
        </a-select-option>
      </a-select>
    </div>
  </template>
  <script>
  export default {
    name:'TemplateSelect',
    data(){
        return {

        }
    },
    methods: {
      handleChange(value) {
        console.log(`selected ${value}`);
      },
    },
  };
  </script>