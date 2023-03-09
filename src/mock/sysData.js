let api = {
  //登录
  // login: {
  //   data: {
  //     token:
  //       'eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzY1NjEzODAsInN1YiI6IjFfd2ViX2J1aWxkaW5nX2JvcCIsImV4cCI6MTU3NjU5NzM4MH0.QPWrUsQroswDn9V6dEzY6AopGKciwrCVuO1dprv2mZ4'
  //   },
  //   message: '成功',
  //   status: 0
  // },
  // 获取登录用户信息
  // getSysUser: {
  //   data: {
  //     id: '1',
  //     loginFlag: '1',
  //     loginName: 'admin',
  //     name: '系统管理员',
  //     photo: '',
  //     remark: '最高管理员',
  //     roleId: []
  //   },
  //   message: '成功',
  //   status: 0
  // },
  // 获取系统字典
  // getSysDict: {
  //   data: { type: [{ value: 1, label: '测试字典' }] },
  //   message: '成功',
  //   status: 0
  // },
  //查询用户菜单
  getUserMenu: {
    data: [
      {
        children: [
          {
            children: [
              {
                children: [
                  {
                    children: [],
                    href: '',
                    icon: '',
                    id: 'a8dff0b802904dbb88169d9e6d3fcedd',
                    isDefault: '1',
                    isShow: '1',
                    menuLevel: 4,
                    name: '查看',
                    parentId: '04824041ac334dc0a96862271db7c1f6',
                    permission: 'my:workplace:wlecome:view',
                    sort: 3
                  }
                ],
                href: '/welcome',
                icon: '',
                id: '04824041ac334dc0a96862271db7c1f6',
                isDefault: '0',
                isShow: '1',
                menuLevel: 3,
                name: '欢迎页',
                parentId: '6756730d33b84586a504a6b757777c78',
                permission: '',
                sort: 1
              }
            ],
            href: 'workplace',
            icon: 'icon-gongzuotai',
            id: '6756730d33b84586a504a6b757777c78',
            isDefault: '0',
            isShow: '1',
            menuLevel: 2,
            name: '工作台',
            parentId: 'fc6653b9374f48488bd617bd4bc9192b',
            permission: '',
            sort: 1
          }
        ],
        href: '/mycenter',
        icon: '',
        id: 'fc6653b9374f48488bd617bd4bc9192b',
        isDefault: '0',
        isShow: '1',
        menuLevel: 1,
        name: '个人中心',
        parentId: '0',
        permission: '',
        sort: 1
      }
    ],
    message: '查询成功!',
    status: 0
  }
};

export default api;
