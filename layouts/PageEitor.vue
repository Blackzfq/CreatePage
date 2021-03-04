<template>
  <div class="Layouts_PageEitor">
    <a-row type="flex" style="flex-wrap:nowrap">
      <a-col flex="40px" style="background-color: #001529;">
        <PageEditorMenu/>
      </a-col>
      <a-col flex="auto" style="height: 100vh;overflow: hidden;">
        <Nuxt />
      </a-col>
      <a-col flex="300px" style="background-color: #001529;">100px</a-col>
    </a-row>
  </div>
</template>

<style lang="scss">
  html {
    font-family:
      'Source Sans Pro',
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      'Helvetica Neue',
      Arial,
      sans-serif;
    font-size: 16px;
    word-spacing: 1px;
  }

  .Layouts_PageEitor {
    min-width: 758px;
    height: 100vh;
    overflow-x: auto;
    overflow-y: hidden;
  }
</style>