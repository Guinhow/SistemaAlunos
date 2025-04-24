import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from './Dashboard';
import Alunos from './Alunos';
import Turmas from './Turmas';
import ConsultaTurmas from './ConsultaTurmas';
import ConsultaAlunos from './ConsultaAlunos';
import Contratos from './Contratos';
import Pagamentos from './Pagamamentos';
import ConsultaPagamentos from './ConsultaPagamentos';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Alunos" component={Alunos} />
      <Drawer.Screen name="ConsultaAlunos" component={ConsultaAlunos} />
      <Drawer.Screen name="Turmas" component={Turmas} />
      <Drawer.Screen name="ConsultaTurmas" component={ConsultaTurmas} />
      <Drawer.Screen name="Contratos" component={Contratos} />
      <Drawer.Screen name="Pagamentos" component={Pagamentos} />
      <Drawer.Screen name="ConsultaPagamentos" component={ConsultaPagamentos} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
