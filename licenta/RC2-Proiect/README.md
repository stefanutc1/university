# Proiect Arhitectură și Segmentare Rețele de Calculatoare (Cisco Packet Tracer)

<div align="center">

[![Tool](https://img.shields.io/badge/Simulation-Cisco%20Packet%20Tracer%208%2B-blue?style=flat&logo=cisco)](proiect%20retele.pkt)
[![Domain](https://img.shields.io/badge/Domain-Computer%20Networking-orange?style=flat)](../../PROJECTS.md)
[![Segmentation](https://img.shields.io/badge/Architecture-VLANs%20%7C%20L3%20Routing%20%7C%20DHCP-teal?style=flat)](proiect%20retele.pkt)
[![Academic Year](https://img.shields.io/badge/Year-Anul%202%20(RC)-purple?style=flat)](../../PROJECTS.md)
[![Status](https://img.shields.io/badge/Status-Completed-brightgreen?style=flat)](../../PROJECTS.md)

</div>

---

## 1. Prezentare Generală

Acest proiect (`licenta/RC2-Proiect`) reprezintă proiectul practic elaborat în cadrul disciplinei **Rețele de Calculatoare (RC)** la Facultatea de Economie și Administrarea Afacerilor (FEAA), Universitatea din Craiova.

Proiectul implementează o topologie completă de rețea enterprise simulată în **Cisco Packet Tracer**, demonstrând principiile de proiectare, adresare IPv4, segmentare logică prin VLAN-uri și rutare inter-VLAN.

---

## 2. Arhitectura Topologiei de Rețea

```mermaid
flowchart TB
    WAN["Edge Gateway / Internet Router"]

    subgraph CORE_LAYER ["Nivel Core & Distribuție"]
        ROUTER["Router Central Cisco (Rutare Inter-VLAN / NAT)"]
        SW_CORE["Switch Distribuție / Trunchiere 802.1Q"]
    end

    subgraph ACCESS_LAYER ["Nivel Acces & Segmentare VLAN"]
        VLAN10["VLAN 10: Administrație & Management<br/>(192.168.10.0/24)"]
        VLAN20["VLAN 20: Birouri & Personal<br/>(192.168.20.0/24)"]
        VLAN30["VLAN 30: Laboratoare Studenți<br/>(192.168.30.0/24)"]
        VLAN_SRV["VLAN 100: Server Farm (DHCP, DNS, Web)<br/>(192.168.100.0/24)"]
    end

    WAN <--> ROUTER
    ROUTER <--> SW_CORE
    SW_CORE --> VLAN10
    SW_CORE --> VLAN20
    SW_CORE --> VLAN30
    SW_CORE --> VLAN_SRV
```

---

## 3. Concepte și Servicii Configurate

1. **Segmentare Logică (VLAN-uri & IEEE 802.1Q):**
   * Separarea traficului între departamente pentru îmbunătățirea securității și reducerea domeniului de difuzare (broadcast domain).
   * Legături de tip Trunk între switch-uri și routere cu încapsulare 802.1Q.
2. **Rutare Inter-VLAN:**
   * Configurare Router-on-a-Stick cu sub-interfețe logice pentru rutarea controlată între subrețele.
3. **Servicii de Rețea:**
   * Alocare dinamică a adreselor IP prin pool-uri DHCP dedicate fiecărui VLAN.
   * Rezoluție de nume DNS internă și servicii web locale.
   * Liste de control al accesului (ACL) pentru filtrarea traficului nesigur.

---

## 4. Artefacte de Simulare

* **`proiect retele.pkt`:** Topologia principală de simulare Cisco Packet Tracer.
* **`proiect retele.pkz`:** Pachetul complet de activitate comprimat incluzând stările echipamentelor și verificările de conectivitate.

Pentru deschiderea și testarea rețelei, utilizați **Cisco Packet Tracer v8.0** sau o versiune ulterioară.
