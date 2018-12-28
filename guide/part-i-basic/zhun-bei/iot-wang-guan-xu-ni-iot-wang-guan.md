# IOT网关/虚拟IOT网关

如你手中有我们厂家的ThingsLink 网关，那就可将ThingsLink 加电，并按照出厂说明进行设置，让ThingsLink 可以连接到Internet。

如你手中没有从我方购买的ThingsLink 网关，又想马上体验ThingsCloud全新的感受，你可以通过如下链接下载预装了FreeIOE软件的虚拟机，并通过虚拟机软件（如VMware Workstation 或者 VM VirtualBox）加载运行起来。

预装了FreeIOE软件的虚拟机的下载地址如下：

[https://thingscloud.oss-cn-beijing.aliyuncs.com/download/freeioe.zip](https://thingscloud.oss-cn-beijing.aliyuncs.com/download/freeioe.zip)

预装了FreeIOE软件的虚拟机使用步骤如下：

1. 解压freeioe.zip文件，将得到名为freeioe.ova的文件。
2. 运行虚拟机软件（这里以VMware Workstation为例），选择文件菜单中的打开（快捷键是Ctrl +  O），选中freeioe.ova文件，点击打开。

![](../../.gitbook/assets/image%20%2824%29.png)

3. 给freeioe虚拟机取个名，导入即可。

![](../../.gitbook/assets/image%20%2816%29.png)

4.  VMware出现导入错误提示（关于规范性，一致性的提示），不用管，点击“重试”即可

![](../../.gitbook/assets/image%20%282%29.png)

5.  导入成功后，可以看见freeioe虚拟机的配置信息，硬件信息可根据自己需要更改。

![](../../.gitbook/assets/image%20%281%29.png)

6. 启动freeioe-test虚拟机，如果你本机能连接互联网，那么freeioe-test虚拟机应该可以连接互联网，如果本机上网环境较为复杂，那么可将freeioe-test虚拟机的“网络适配器 2”改为“NAT模式”。

![](../../.gitbook/assets/image%20%285%29.png)

7. freeioe虚拟机系统采用的是openwrt开源路由系统，第一块网卡是LAN模式，默认IP地址是192.168.1.1；第二块网卡是WAN模式，默认是自动获取IP地址。freeioe虚拟机运行进入console后，将会打印出LAN口和WAN后当前的IP地址。

![](../../.gitbook/assets/image%20%2831%29.png)

以上就是虚拟IOT网关的搭建过程。

