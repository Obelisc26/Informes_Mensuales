import { SOCDashboard } from "@/components/soc/SOCDashboard";
import { useSearchParams } from "react-router-dom";

const Index = () => {
  const [searchParams] = useSearchParams();
  
  const cliente = searchParams.get("cliente") || "ACME Corp";
  const periodo = searchParams.get("periodo") || "01–30 jun 2025";
  const autores = searchParams.get("autores") || "Equipo SOC";

  return (
    <SOCDashboard 
      cliente={cliente}
      periodo={periodo}
      autores={autores}
    />
  );
};

export default Index;
