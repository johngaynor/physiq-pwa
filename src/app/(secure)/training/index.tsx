"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import { Input, Button } from "@/components/ui";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Loader2 } from "lucide-react";

function mapStateToProps(state: RootState) {
  return {};
}

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Training: React.FC<PropsFromRedux> = ({}) => {
  return <div className="w-full">hey</div>;
};

export default connector(Training);
