import {
  createAPi
} from './http'
/**
 * g is get
 * p is post
 * a is post_and_return_all (data with code and msg)
 * return is like {code:200,data:<any>,msg:<String or null>}
 **/
export default {
  testApiA: createAPi('xxxxxxxx', 'a'), // post and return all 
  testApiB: createAPi('xxxxxx', 'g'), // get  and olny return data
  testApiC: createAPi('xxxxxxxx', 'p'), // post and only reutnr data 
  testApiD: createAPi('xxxxxxxx'), // like post 
}



/***
 * in Vue 
 * import apis from './http/apis'
 * Vue.prototype.$apis = apis
 * 
 * 
 * u can use it like 
 * this.$apis.testApiA(this.form)
 * .then(res => {
 *  this.data = res
 * // do some things
 * })
 * 
 * and u can ignore error 
 * 
 * or use like this
 *  if you like you can add try catch
 * async getData (){
 *  this.data = await this.$apis.testApiA(this.form)
 *  // do some things
 * }
 */