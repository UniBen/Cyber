<script>
    import mix from 'mix-color';

    export default {
        name: 'ParseCSS',

        props: {
            range: Number
        },

        data: () => ({
          colours: []
        }),

        render(createElement) {
            let styles = '';
            for (let i = 0; i <= this.range; i++) {
                styles += '[data-difference="' + i + '"] { background-color: ' +  mix('#90ee90', '#f08080', (100/(this.range * 100)) * i) + '; }\n';
            }

            return createElement('style', styles);
        }
    }
</script>