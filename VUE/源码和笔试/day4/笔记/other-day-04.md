# Vue高级4

今日内容

1. 组件传值大全
2. 海量数据渲染的优化

## 1.组件传值大全

### 1.1父子组件传值

#### 1.1.1父向子传值

打开今天案例中的params-test项目

启动运行，然后查看首页中的`父传子`

查看页面的内容，查看代码注释，并完成练习。

然后我们总结一下

> 总结：
>
> 在父组件对子组件传值时我们使用props作为参数媒介，子组件可以持续监听到父组件传入值的变化，子组件不可以更改父组件传入的值。所以传值方向是单一的,父 -> 子(组件外向组件内)

#### 1.1.2子传父

打开首页中的`子传父`

查看内部的代码和注释。并完成练习。

> 总结：
>
> 我们通过学习案例之后发现子传父的传值方式不同于父传子，他需要通过函数回调的形式来实现传值，在子组件中只要执行了this.$emit('函数名',参数)
>
> 这个组件的标签上就可以定义一个@函数名的自定义事件并且这个事件对应的js函数也会执行，并且函数的参数就是this.$emit传入的参数，这样便实现了子组件将其内部的数据传输到父组件中。
>
> 显然这种方式虽然好理解但是不方便使用。

#### 1.1.3基于父传子，子传父整合的双向传参数

打开案例中的`双向传参数`

查看内部的代码，注释。完成学习后看总结。

> 总结：
>
> 我们根据结合父传子，子传父的方式分析一下当前案例，并且结合打印信息发现，每次操作自定义组件触发值的变化这个过程触发的就是子传父，他相当于先触发子传父函数执行将值传入父组件，父组件绑定的函数执行从而得到子组件传出的参数。
>
> 当父组件改变传入的参数时仅仅会触发子组件的props参数监听触发子组件更新渲染，并不会像父组件反值

#### 1.1.4双向传参数的高级封装双向绑定

vue对两个方向的参数传输进行了更简便的封装，所以定义除了v-model来实现双向绑定。

下面我们打开案例中的`双向绑定`

查看内部的内容，页面的代码和注释。

并且对比1.1.3中的案例查看封装的传参数结果

#### 1.1.5多重双向绑定

我们在过去的vue学习中了解到的知识范围是一个组件只有一个v-model，所以认为一个组件只能实现一个属性进行双向绑定。

打开案例中的菜单`多重双向绑定`

我们阅读案例并阅读注释，操作之后回来看总结。

> 总结：
>
> 多重双向绑定是建立在v-model更上层的东西，他是由vue完全托管双向绑定的过程，不需要我们处理接传值，只需要在参数后面加.sync这样想要变更这个参数直接通过子组件中调用this.$emit('update:参数名',变更的值)就能实现直接变更.sync修饰的参数的值

#### 1.1.6大总结

到此为止我们学会了所有的父子之间直接进行传参数的常用方式，有单向的有双向的，有综合的。其实父子传参数还有很多其他的方式，**比如this.$children和this.$parent也是可以直接操作父子组件内容的，比如this.$refs是单独父传子的一种方式**。所以我们在学习完这些之后要将所有传参数的方式背下来，这个是面试必考考点。

### 1.2跨代组件

跨代组件是在父子传参之上的更复杂的组件关系，比如三个组件嵌套，我们在最外层想直接对内部的所有组件或某一个或某一些组件传递参数。这时直接使用props需要每一层的组件都定义相同的参数这种方式显然工作量过大。

打开案例中的`跨代组件`

查看运行结果并查看注释。

> 总结：
>
> 我们在跨代传参数的场景如果涉及到子孙组件需要继承同样的祖先组件的值的时候，如果使用props会造成代码特别复杂，不同组件间的耦合度升高，这样会导致代码难以维护，所以vue对组件中统一封装了一个provide和inject机制，只要定义了provide的祖先组件就可以在他的任何子孙组件中使用inject来提取provide中的值，这是vue为我们提供的一个跨代组件传输的统一解决方案。

### 1.3兄弟组件或无关联组件

兄弟组件或无关联组件表示平级或不平级且不涉及嵌套的两个或多个组件，他们由于没有嵌套关系，完全不能使用1.1和1.2中介绍的组件传参数机制。

这时有人会想到用全局变量或者sessionStorage以及localStorage的方式来在不同组件中共享参数。

这种方式虽然能实现，但是无法实现Vue的订阅发布机制。也就是说我们通过普通变量在跨组件中共享数据是可行的但是在vue的数据变更时无法实现实时更新。这时我们就需要通过下面介绍的几种方式来实现这些无相关组件间的数据共享了。

#### 1.3.1通过Vue.observable的方式

首先我们打开案例中的`observable传参`

我们查看代码和注释来学习一下如何通过Vue.observable共享组件之间的参数

> 总结:
>
> 我们通过Vue.observable创建的响应式对象可以被Vue全局对象捕获观察，所以可以放在任何Vue组件中的computed中，只要数据源的值发生变化就会触发所有涉及到这个值的computed计算属性重新计算实现值的更新，这样便实现了无关联组件的数据共享和传输

#### 1.3.2通过Vuex的方式

同1.3.1。案例在市面上有很多，我们做过的项目也用过很多Vuex所以今天就不具体举例子了。只要记住他的不同组件值的方式与Vue.observable是完全一样的。如果在做大型项目时引入了Vuex完全可以直接通过他来共享数据。如果涉及到小项目没有Vuex就使用Vue.observable来共享数据

#### 1.3.3通过eventBus的方式

打开案例中的`eventBus传参`来查看案例并学习。根据注释学习代码。

> 总结：
>
> eventBus说白了其实就是借用了一个新的Vue对象，我们在使用自定义组件时发现了可以通过this.$emit()来执行本组件上定义的函数，而定义的函数其实就是v-on绑定的函数。其实vue本身具备与nodejs相同的事件驱动机制，可以动过this.$on来定义一个监听函数，并且通过this.$emit来执行，我们通过借用一个new Vue对象来实现将所有的事件绑定到他的身上，来实现emit和on的配对。这样就能在不同的组件间通过on和emit进行通信。



## 2海量数据渲染的优化

### 2.1通过Obejct.freeze对中量数据渲染的优化

还是打开之前案例的项目，我们查看`海量数据渲染`

这个案例，按照注释的步骤我们读一下代码并按要求演示并查看数据。

> 总结：
>
> 在使用了Obejct.freeze之后的数据渲染总会比不使用它快，因为什么呢？因为Obejct.freeze执行过的对象会变成不可写对象，这样将他设置到Vue对象上之后就不会触发Object.defineProperty去对这个数据进行监听。我们在学习这个api的时候知道这个api只能指定字段进行监听也就是说字段越多的数据观察者完成监听的耗时就越长，所以我们通过Object.freeze冻结了list之后Vue就不能再监听他的数据变化，这时我们就可以省略了Obejct.defineProperty这个过程。所以渲染时间也就变小了，但是这个方式处理完的list同时也不具备数据响应了，也即是list的值变了页面不会更新，它主要用于优化制作展示数据的部分。

### 2.2通过增量更新优化数据

在上一个案例中我们可以最终尝试到16000条数据的文件，如果电脑性能够用可以使用32000在体验一次。

然后我们发现越大量的数据一次性渲染越慢，并且通过Object.freeze的方式的时间差也就越大。我们发现了Object.freeze的优化结果是有效的。如果我们想更加友好的体验这个数据的加载可以做如下分析。

我们的网页正常展示给我们的空间是有限的，比如一屏网页可能大一点显示器的能展示100条数据，小一点的10条，假设我们一开始只引入总数据，不一次性让他们都渲染到网页上是否加载时间就会缩短呢。

我们打开案例中的`增量更新`

然后我们打开页面中查看打印信息，我们默认引入的是8000条数据的数组，然后我们在看这回的默认加载时间，控制台打印的时间不到10毫秒。

第一次渲染通过slice方法截取了前100条数据

我们在视觉上发现不了少加载数据了，并且第一次加载的时间变得非常的少。

如果想要看完整的数据，是通过在下翻网页的时候通过滚动事件监听页面的变化，在即将要拉到页面底部的时候动态加载新的数据，这样就算是8000条数据也可以做到无感知的加载完。这种就叫做增量更新

这种增量更新的方式大大提升了海量数据加载的速度，使页面可以无感知的瞬间加载数万条的数据而不用考虑页面卡顿的问题。这种增量更新在我们的react移动端项目中的体现就是移动端的分页查询，他是通过从数据库分次加载数据来实现增量更新，而这次是本地如果直接有海量数据的话，我们就需要使用这种增量更新来提升效率了。