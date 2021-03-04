<template>
    <div class="CreateProduct">
        <ProductForm />
    </div>
</template>
<script>
    export default {
        name: 'CreateProduct',
        data() {

            return {
                
            }
        }
    }
</script>
<style scoped lang="scss">
    .CreateProduct {
        min-width: 1100px;

        &::v-deep .aformmodel {
            display: grid;
            grid-template-columns: auto 400px;
            grid-column-gap: 30px;

            .right_form {
                position: relative;

                .right_form_content {
                    position: sticky;
                    top: 0;
                }
            }
        }
    }
</style>